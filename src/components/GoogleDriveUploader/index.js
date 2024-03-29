import useDrivePicker from "react-google-drive-picker";

function GoogleDriveUploader({ onSelectFile }) {
  const [openPicker, authResponse] = useDrivePicker();
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId: "753430601932-73fsb3o0oapabrf88j6978glgc0nqhh4.apps.googleusercontent.com",
      developerKey: "AIzaSyA_Zb0roinIj-ITlgvAFJWF440HCPTnjeQ",
      viewId: "DOCS",
      // token: token, // pass oauth token in case you already have one
      supportDrives: true,
      multiselect: true,
      setIncludeFolders: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        if (data.docs?.length > 0) {
          const choosenFiles = data.docs.map(({ name, id }) => ({
            url: `https://drive.google.com/u/0/uc?id=${id}`,
            name,
            id,
          }));
          onSelectFile(choosenFiles);
        }
      },
    });
  };

  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}

export default GoogleDriveUploader;
