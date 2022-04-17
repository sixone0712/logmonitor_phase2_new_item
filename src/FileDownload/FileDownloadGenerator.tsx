import { Button, Input, Modal, Progress } from "antd";
import saveAs from "file-saver";
import { useState } from "react";
import { chuckSize, generatorChuck, getfileInfo } from "../util/download";

export default function FileDownloadGenerator() {
  const [url, setUrl] = useState("/1.zip");
  const [open, setOpen] = useState(false);
  const [persent, setPercent] = useState(0);

  const download = async () => {
    try {
      const {
        name: fileName,
        size: fileSize,
        type: fileType,
      } = await getfileInfo(url);
      console.log("fileSize", fileSize);

      let dnSize = 0;
      const dnChuck: BlobPart[] = [];

      for await (const item of generatorChuck({ url, fileSize, chuckSize })) {
        dnChuck.push(item.data as Blob);
        dnSize += item.length;
        console.log("dnSize", dnSize, Math.floor((dnSize / fileSize) * 100));
        setPercent(Math.floor((dnSize / fileSize) * 100));
      }

      const fileBlob = new Blob(dnChuck, { type: fileType });

      if (fileBlob.size !== fileSize) {
        throw Error(
          `file size is different.(fileSize:${fileSize} / blobSize:${fileBlob.size})`
        );
      }

      saveAs(fileBlob, fileName);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Input value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button onClick={download}>Download</Button>
      <Button
        onClick={() => {
          download();
          setOpen(true);
        }}
      >
        Modal
      </Button>
      <Modal
        okButtonProps={{
          hidden: true,
        }}
        title="Download File"
        visible={open}
        onCancel={() => setOpen(false)}
      >
        <Progress percent={persent} />
      </Modal>
    </div>
  );
}
