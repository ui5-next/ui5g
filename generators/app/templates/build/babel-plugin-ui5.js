const Path = require("path");
const { cloneDeep, countBy, forEach, filter, concat, find, split, slice, join } = require("lodash");

/**
 * get full extesion name
 * @param {string} path
 */
const extensionName = (path) => {
  var r = join(slice(split(path, "."), 1), ".");
  if (r) {
    return `.${r}`;
  }
  return r;
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
        // > process root statements
        const rootStatement = filter(path.node.body, n => (n.type == "ExpressionStatement" || n.type == "VariableDeclaration"));
        path.node.body = filter(path.node.body, n => (n.type != "ExpressionStatement" && n.type != "VariableDeclaration"));
        // < process root statements

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
          exports: [],
          rootStatement
        };
      },
      exit: path => {
        const state = path.state.ui5;
        const program = path.hub.file.ast.program;
        const fileAbsPath = t.stringLiteral(Path.normalize(state.namePath));
        var defineCallArgs = [];
        if (state.exports.length > 0) {

          const counts = countBy(state.exports, "type");
          const haveDefualtExport = counts["ExportDefaultDeclaration"] ? true : false;
          const haveOtherExport = counts["ExportNamedDeclaration"] ? true : false;
          const defaultExport = find(state.exports, { type: "ExportDefaultDeclaration" });
          // with export thing
          if (haveDefualtExport && !(haveOtherExport)) {
            var declaration = state.exports[0].declaration;

            defineCallArgs = [
              fileAbsPath,
              t.arrayExpression(state.imports.map(i => t.stringLiteral(i.src)))
            ];
            switch (declaration.type) {
            case "ClassDeclaration":
              defineCallArgs.push(
                t.functionExpression(null, state.imports.map(i => t.identifier(i.name)), t.blockStatement(concat(
                  state.rootStatement,
                  t.returnStatement(transformClass(defaultExport.declaration, program, state))
                )))
              );
              break;
            case "ObjectExpression":
              defineCallArgs.push(
                declaration
              );
              break;
            default:

              break;
            }

          } else if ((!haveDefualtExport) && haveOtherExport) {
            const props = [];

            forEach(path.state.ui5.exports, node => {
              var varD = node.declaration.declarations[0];
              props.push(t.objectProperty(varD.id, varD.init));
            });

            defineCallArgs = [
              fileAbsPath,
              t.arrayExpression(),
              t.objectExpression(props)
            ];
          }


        } else {
          // without export thing
          defineCallArgs = [
            fileAbsPath,
            t.arrayExpression(state.imports.map(i => t.stringLiteral(i.src))),
            t.functionExpression(null, state.imports.map(i => t.identifier(i.name)), t.blockStatement(state.rootStatement))
          ];

        }
        const defineCall = t.callExpression(t.identifier("sap.ui.define"), defineCallArgs);
        if (state.leadingComments) {
          defineCall.leadingComments = state.leadingComments;
        }

        path.node.body.push(defineCall);
      }

    },

    ImportDeclaration: {
      enter: path => {
        const state = path.state.ui5;
        const node = path.node;
        let name = null;

        let src = node.source.value;
        if (src.startsWith("./") || src.startsWith("../") || !src.startsWith("sap")) {
          try {
            const sourceRootPath = getSourceRoot(path);
            src = Path.join(projectNamePath, Path.relative(sourceRootPath, Path.resolve(Path.dirname(path.hub.file.opts.filename), src))).replace(/\\/g, "");
          } catch (e) {
            // pass
          }
        }


        if (node.specifiers && node.specifiers.length === 1) {
          name = node.specifiers[0].local.name;
        } else {
          const parts = src.split(Path.sep);
          name = parts[parts.length - 1];
        }

        if (node.leadingComments) {
          state.leadingComments = node.leadingComments;
        }

        const imp = {
          name,
          src: src.replace(/\\/g, "/")
        };
        state.imports.push(imp);

        path.remove();
      }
    },

    ExportDeclaration: {
      exit: path => {
        const state = path.state.ui5;
        path.traverse({

          CallExpression(innerPath) {

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
        });

        state.exports.push(cloneDeep(path.node));

        path.remove();
      }
    }


  };

  function transformClass(node, program, state) {

    if (node.type !== "ClassDeclaration") {
      return node;
    } else {

      var superClassName = node.superClass.name;
      var fullClassName = "";

      if (state.namespace) {
        fullClassName = state.namespace;
      } else {
        fullClassName = node.id.name;
      }

      const props = [];
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
        return t.callExpression(t.identifier("sap.ui.jsview"), [
          t.stringLiteral(fullClassName),
          t.objectExpression(props)
        ]);
      default:
        return t.callExpression(t.identifier(superClassName + ".extend"), [
          t.stringLiteral(fullClassName),
          t.objectExpression(props)
        ]);
      }

    }
  }

  function getSourceRoot(path) {
    let sourceRootPath = null;
    if (path.hub.file.opts.sourceRoot) {
      sourceRootPath = Path.resolve(path.hub.file.opts.sourceRoot);
    } else {
      sourceRootPath = Path.resolve("." + Path.sep);
    }
    return sourceRootPath;
  }

  return {
    visitor: visitor
  };
};

module.exports = exports.default;