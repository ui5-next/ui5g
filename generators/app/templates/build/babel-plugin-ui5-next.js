const Path = require("path");
const { concat, split, slice, join, filter, find, flatten, map, isEmpty, trim } = require("lodash");

const extensionName = (path) => {
  var r = join(slice(split(path, "."), 1), ".");
  if (r) {
    return `.${r}`;
  }
  return r;
};

const getSourceRoot = (path) => {
  let sourceRootPath = null;
  if (path.hub.file.opts.sourceRoot) {
    sourceRootPath = Path.resolve(path.hub.file.opts.sourceRoot);
  } else {
    sourceRootPath = Path.resolve("." + Path.sep);
  }
  return sourceRootPath;
};


exports.default = (configNameSpace = "") => function({ types: t }) {
  /**
   * project namespace
   */
  const projectNameSpace = configNameSpace;
  /**
   * project namespace to path
   */
  const projectNamePath = configNameSpace.replace(/\./g, "/");

  const getAddStyleExpression = (classes = [], expression) => {
    if (isEmpty(classes)) {
      return expression;
    } else {
      var toBeAddedClass = classes.pop();
      return getAddStyleExpression(
        classes,
        t.callExpression(
          t.memberExpression(expression, t.identifier("addStyleClass")),
          [t.stringLiteral(toBeAddedClass)]
        )
      );
    }
  };


  const visitor = {
    Program: {
      enter: path => {
        const filePath = Path.resolve(path.hub.file.opts.filename);

        const sourceRootPath = getSourceRoot(path);

        let relativeFilePath = null;
        let relativeFilePathWithoutExtension = null;

        let namespace = projectNameSpace;
        let namepath = projectNamePath;

        if (filePath.startsWith(sourceRootPath)) {
          relativeFilePath = Path.relative(sourceRootPath, filePath);
          relativeFilePathWithoutExtension = Path.dirname(relativeFilePath) + Path.sep + Path.basename(relativeFilePath, extensionName(relativeFilePath));
          relativeFilePathWithoutExtension = relativeFilePathWithoutExtension.replace(/\\/g, "/");
          namepath = Path.join(namepath, relativeFilePathWithoutExtension).replace(/\\/g, "/");
          // not root file
          namespace = namepath.replace(/\//g, ".");
        }

        if (!path.state) {
          path.state = {};
        }

        path.state.ui5 = {
          filePath,
          sourceRootPath,
          relativeFilePath,
          relativeFilePathWithoutExtension,
          namespace,
          namePath: namepath,
          className: null,
          fullClassName: null,
          superClassName: null,
          imports: [],
          exports: []
        };
      },
      exit: path => {
        const { imports, namePath } = path.state.ui5;
        const fileAbsPath = t.stringLiteral(Path.normalize(namePath));

        const importsIdentifier = imports.map(i => t.identifier(i.name));
        const importsSources = imports.map(i => t.stringLiteral(i.src));
        const _default = t.identifier("_default");

        const importExtractVars = flatten(
          map(
            filter(imports, i => i.specifiers.length > 0),
            i => i.specifiers.map(
              s => t.variableDeclaration(
                "var",
                [
                  t.variableDeclarator(
                    s.local,
                    t.memberExpression(t.identifier(i.name), s.imported)
                  )
                ]
              )
            )
          )
        );

        const defineCallArgs = [
          fileAbsPath,
          t.arrayExpression(importsSources),
          t.functionExpression(
            null, importsIdentifier, t.blockStatement(
              concat(
                importExtractVars,
                t.variableDeclaration(
                  "var",
                  [
                    t.variableDeclarator(
                      _default,
                      t.objectExpression([])
                    )
                  ]
                ),
                path.node.body, // original body
                t.returnStatement(_default)
              )
            )
          )
        ];

        const defineCall = t.callExpression(t.identifier("sap.ui.define"), defineCallArgs);

        path.node.body = [defineCall];

      }

    },

    JSXText: {
      enter: path => {
        const jsxElement = path.find(p => p.type == "JSXElement");
        const value = path.node.value;
        if (!trim(value) == "\n") {
          jsxElement.node.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier("text"), t.stringLiteral(value)));
        }
        path.remove();
      }
    },
    JSXElement: {
      exit: path => {
        // get jsx element type
        const tag = path.node.openingElement.name.name;
        var classes = [];
        // map attrs to object property
        const props = path.node.openingElement.attributes.map(p => {
          if (p.name.name == "class") {
            classes = concat(classes, split(p.value.value, " "));
          }
          var id = t.identifier(p.name.name);
          switch (p.value.type) {
          case "JSXExpressionContainer":
            return t.objectProperty(id, p.value.expression);
          default:
            return t.objectProperty(id, p.value);
          }

        }) || [];

        // > inner children
        const children = filter(path.node.children, c => {

          switch (c.type) {
          case "NewExpression": case "CallExpression":
            return true;
          default:
            return false;
          }

        });

        if (children && children.length > 0) {
          props.push(t.objectProperty(t.identifier("content"), t.arrayExpression(children)));
        }

        // < inner children

        var expression = t.newExpression(
          t.identifier(tag),
          [
            t.objectExpression(props)
          ]
        );

        if (!isEmpty(classes)) {
          expression = getAddStyleExpression(classes, expression);
        }

        path.replaceWith(expression);

      }
    },

    ImportDeclaration: {
      enter: path => {
        const state = path.state.ui5;
        const node = path.node;

        var name = "";

        let src = node.source.value;
        if (src.startsWith("./") || src.startsWith("../") || !src.startsWith("sap")) {
          try {
            const sourceRootPath = getSourceRoot(path);
            src = Path.join(
              projectNamePath,
              Path.relative(
                sourceRootPath,
                Path.resolve(Path.dirname(path.hub.file.opts.filename), src)
              )
            ).replace(/\\/g, "");
          } catch (e) {
            // pass
          }
        }

        src = src.replace(/\\/g, "/");

        name = src.split("/").pop();

        var _defaultSpecifier = find(node.specifiers, { "type": "ImportDefaultSpecifier" });
        var _normalSpecifiers = filter(node.specifiers, { "type": "ImportSpecifier" });

        if (_defaultSpecifier) {
          name = _defaultSpecifier.local.name;
        }

        const imp = {
          src: src.replace(/\\/g, "/"),
          specifiers: _normalSpecifiers || [],
          name
        };
        state.imports.push(imp);

        path.remove();
      }
    },

    ExportDeclaration: {
      exit: path => {
        const _default = t.identifier("_default");
        var assign;
        switch (path.node.type) {
        case "ExportDefaultDeclaration":
          assign = t.assignmentExpression(
            "=",
            _default,
            t.callExpression(
              t.memberExpression(
                t.identifier("Object"), t.identifier("assign")),
              [path.node.declaration, _default]
            )
          );
          break;
        case "ExportNamedDeclaration":
          assign = t.assignmentExpression(
            "=",
            t.memberExpression(
              _default,
              path.node.declaration.declarations[0].id
            ),
            path.node.declaration.declarations[0].init
          );
          break;
        default:
          break;
        }
        if (assign) {
          path.replaceWith(assign);
        }
      }
    },

    ClassDeclaration: {
      exit: path => {

        const state = path.state.ui5;
        const node = path.node;
        const props = [];
        var superClassName = node.superClass.name;
        var fullClassName = "";
        var className = node.id.name;
        var expression = {};

        if (state.namespace) {
          fullClassName = state.namespace;
        } else {
          fullClassName = node.id.name;
        }

        node.body.body.forEach(member => {
          if (member.type === "ClassMethod") {
            const func = t.functionExpression(null, member.params, member.body);
            func.generator = member.generator;
            func.async = member.async;
            props.push(t.objectProperty(member.key, func));
          } else if (member.type == "ClassProperty") {
            props.push(t.objectProperty(member.key, member.value));
          }
        });

        switch (superClassName) {
        case "JSView":
          props.push(
            t.objectProperty(
              t.identifier("getControllerName"),
              t.functionExpression(
                null,
                [],
                t.blockStatement([t.returnStatement(t.stringLiteral(fullClassName))])
              )
            )
          );
          expression = t.logicalExpression(
            "||",
            t.callExpression(t.identifier("sap.ui.jsview"), [
              t.stringLiteral(fullClassName),
              t.objectExpression(props)
            ]),
            t.objectExpression([])
          );
          break;
        case "Fragment":
          expression = t.logicalExpression(
            "||",
            t.callExpression(t.identifier("sap.ui.jsfragment"), [
              t.stringLiteral(fullClassName),
              t.objectExpression(props)
            ]),
            t.objectExpression([])
          );

          break;
        default:
          expression = t.callExpression(t.identifier(superClassName + ".extend"), [
            t.stringLiteral(fullClassName),
            t.objectExpression(props)
          ]);
          break;
        }


        if (path.parent && path.parent.type == "ExportNamedDeclaration") {
          path.replaceWith(t.variableDeclaration("var", [t.variableDeclarator(t.identifier(className), expression)]));
        } else {
          path.replaceWith(expression);
        }

      }
    },

    CallExpression: {
      enter: innerPath => {

        const node = innerPath.node;

        innerPath.findParent((p) => {
          if (p.isClassDeclaration()) {
            const superClassName = p.node.superClass.name;

            if (node.callee.type === "Super") {
              if (!superClassName) {
                this.errorWithNode("The keyword 'super' can only used in a derrived class.");
              }

              const identifier = t.identifier(superClassName + ".apply");
              let args = t.arrayExpression(node.arguments);
              if (node.arguments.length === 1 && node.arguments[0].type === "Identifier" && node.arguments[0].name === "arguments") {
                args = t.identifier("arguments");
              }
              innerPath.replaceWith(
                t.callExpression(identifier, [
                  t.identifier("this"),
                  args
                ])
              );
            } else if (node.callee.object && node.callee.object.type === "Super") {
              if (!superClassName) {
                this.errorWithNode("The keyword 'super' can only used in a derrived class.");
              }
              const identifier = t.identifier(superClassName + ".prototype" + "." + node.callee.property.name + ".apply");
              innerPath.replaceWith(
                t.callExpression(identifier, [
                  t.identifier("this"),
                  t.arrayExpression(node.arguments)
                ])
              );
            }
          }
        });

      }

    }
  };


  return {
    visitor: visitor
  };
};

module.exports = exports.default;