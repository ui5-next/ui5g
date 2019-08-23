import Input from "sap/m/Input";
import Core from "sap/ui/core/Core";

var input = <Input value="1" />;

Core.attachInit(() => {

  // after init, dom UIArea is available
  input.placeAt("content");

});
