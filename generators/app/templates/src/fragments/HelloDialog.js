import Dialog from "sap/m/Dialog";
import Icon from "sap/ui/core/Icon";
import Button from "sap/m/Button";

export const createHelloDialog = oController => (
  <Dialog
    id="helloDialog"
    title="Hello {/recipient/name}"
    beginButton={
      <Button
        text="{i18n>dialogCloseButtonText}"
        press={oController.onCloseDialog}
      />
    }
  >
    <Icon
      src="sap-icon://hello-world"
      size="8rem"
      class="sapUiMediumMargin"
    />
  </Dialog>
)
