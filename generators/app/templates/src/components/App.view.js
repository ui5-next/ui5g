import Application from "sap/m/App";
import JSView from "sap/ui/core/mvc/JSView";

export default class App extends JSView {

  createContent() {
    return new Application({ id: "app" });
  }

}
