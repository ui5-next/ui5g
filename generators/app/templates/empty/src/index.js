import Input from "sap/m/Input";
import ui from "sap/ui";

var input = <Input value="1" />;

ui.getCore().attachInit(() => {

  // after init, dom UIArea is available
  input.placeAt("content");

});
