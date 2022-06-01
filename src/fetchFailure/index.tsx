import React from "react";
import { Image } from "antd";

const FetchFailure = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Image
        width={200}
        src="https://www.globalsign.com/application/files/9516/0389/3750/What_Is_an_SSL_Common_Name_Mismatch_Error_-_Blog_Image.jpg"
      />
      <br />
      <p>Error loading the contacts</p>
    </div>
  );
};

export default FetchFailure;
