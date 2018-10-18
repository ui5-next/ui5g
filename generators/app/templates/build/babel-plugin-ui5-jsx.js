const { filter, concat, split, isEmpty, trim } = require("lodash");

module.exports = function({ types: t }) {

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

  return {
    visitor: {
      JSXText: {
        enter: path => {
          const jsxElement = path.find(p => p.type == "JSXElement");
          const value = path.node.value;
          if(!trim(value) == "\n"){
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
      }
    }
  };
};