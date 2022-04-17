import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Popover,
  Radio,
  RadioChangeEvent,
  Upload,
} from "antd";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import axios from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { H_SPACE } from "../App";
import { v4 as uuidv4 } from "uuid";

export default function Import() {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"directory" | "files">("directory");
  const buttonRef = useRef<HTMLBRElement>(null);
  const [savedFiles, setSavedFile] = useState<string[]>([]);
  const [error, setError] = useState("");

  const openModal = useCallback(
    (open: boolean) => () => {
      setOpen(open);
    },
    []
  );

  const onChangeMode = useCallback((e: RadioChangeEvent) => {
    setMode(e.target.value);
    setFileList([]);
  }, []);

  const propsBefore = {
    onRemove: (file: UploadFile<any>) => {
      const fileInfo = file as RcFile;
      setFileList((prev) => {
        const index = prev.indexOf(fileInfo);
        const newFileList = prev.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file: RcFile) => {
      setFileList((prev) => [...prev, file]);
      return false;
    },
    fileList,
  };

  const itemRender = useCallback(
    (
      originNode: React.ReactElement,
      file: UploadFile,
      fileList: Array<UploadFile>
    ) => {
      if (mode === "directory") {
        return (
          <CustomItemRender
            originNode={originNode}
            file={file}
            fileList={fileList}
          />
        );
      } else {
        return originNode;
      }
    },
    [mode]
  );

  const deleteAllFile = useCallback((e?: React.MouseEvent<HTMLElement>) => {
    console.log("e", e);
    if (e) e.stopPropagation();
    setFileList([]);
  }, []);

  const handleUpload = async () => {
    let pythonStart = false;
    let shellStart = false;
    const formData = new FormData();
    const dirJson: { [key: string]: string } = {};

    if (fileList.length === 0) {
      return setError("Please select at least one file.");
    }

    fileList.forEach((file) => {
      formData.append("files", file);
      const filePath = file.webkitRelativePath.split("/");
      const fileName = filePath.pop();
      filePath.shift();
      const dirPath = filePath.length === 0 ? "" : filePath.join("/");
      console.log("file.webkitRelativePath", file.webkitRelativePath);
      console.log("dirPath, fileName", dirPath, fileName);

      if (fileName) dirJson[fileName] = dirPath;
      if (dirPath === "" && fileName === "main.py") pythonStart = true;
      if (dirPath === "" && fileName === "start.sh") shellStart = true;

      //temp
      if (1) {
        const filePath = file.webkitRelativePath.split("/");
        filePath.shift();
        setSavedFile((prev) => [...prev, filePath.join("/")]);
      }
    });

    //formData.append("directory", JSON.stringify(dirJson));
    formData.append("uuid", uuidv4());
    formData.append("directory", mode === "directory" ? "true" : "false");

    // if ((pythonStart && shellStart) || (!pythonStart && !shellStart)) {
    //   return setError(
    //     "You only need to import one of 'main.py' and 'start.sh'."
    //   );
    // }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/upload",
        formData
      );
      setFileList([]);
      message.success("upload successfully.");
    } catch (e) {
      message.error("upload failed.");
    }
  };

  useEffect(() => {
    if (!open) {
      setMode("directory");
      setFileList([]);
      setError("");
    }
  }, [open]);

  return (
    <>
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Popover
          placement="right"
          trigger="click"
          content={
            <div
              css={css`
                width: 20rem;
                height: 30rem;
                overflow: auto;
              `}
            >
              {savedFiles.map((item) => (
                <div>{item}</div>
              ))}
            </div>
          }
          title="File List"
        >
          <div>{`${savedFiles.length} files`}</div>
        </Popover>

        <H_SPACE />
        <Button onClick={openModal(true)}>Import</Button>
        <H_SPACE />
        <Button>Export</Button>
      </div>
      <Modal
        visible={open}
        closable
        onCancel={openModal(false)}
        title="Import Files"
        width={500}
        onOk={handleUpload}
      >
        <div css={style}>
          <div className="select-section">
            <Radio.Group value={mode} onChange={onChangeMode}>
              <Radio value="directory">Directory</Radio>
              <Radio value="files">Files</Radio>
            </Radio.Group>
          </div>
          <div className="upload-section">
            <Upload
              {...propsBefore}
              multiple={mode === "files"}
              directory={mode === "directory"}
              itemRender={itemRender}
            >
              {mode === "directory" ? (
                <Button
                  className="select-btn"
                  icon={<UploadOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    Modal.confirm({
                      title: "Select Directory",
                      content: `Uploaded files are deleted. Would you like to continue?`,
                      onOk: () => {
                        setFileList([]);
                        if (buttonRef?.current?.previousSibling) {
                          (
                            buttonRef.current.previousSibling as HTMLElement
                          ).click();
                        }
                      },
                    });
                  }}
                  ref={buttonRef}
                >
                  Select Directory
                </Button>
              ) : (
                <Button className="select-btn" icon={<UploadOutlined />}>
                  Select Files
                </Button>
              )}

              <Popconfirm title="Delete All Files" onConfirm={deleteAllFile}>
                <Button
                  className="delete-btn"
                  icon={<DeleteOutlined />}
                  type="dashed"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Popconfirm>
            </Upload>
          </div>
          {error && (
            <div className="error-section">
              <ExclamationCircleOutlined />
              <div>{error}</div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

const style = css`
  .select-section {
    margin-bottom: 2rem;
    color: red;
  }
  .upload-section {
    .ant-upload-list.ant-upload-list-text {
      overflow: auto;
      max-height: 30rem;
    }

    .ant-upload.ant-upload-select.ant-upload-select-text {
      .select-btn {
        width: 10rem;
      }
      .delete-btn {
        margin-left: 1rem;
      }
    }

    .select-files {
      display: flex;
      justify-content: center;
    }
    .delete-all {
      display: flex;
      justify-content: flex-end;
    }
  }

  .error-section {
    display: flex;
    align-items: center;
    color: red;
    margin-top: 1rem;
    .anticon {
      margin-right: 0.5rem;
    }
  }
`;

const CustomItemRender = memo(function CustomItemRenderMemo({
  originNode,
  file,
  fileList,
}: {
  originNode: React.ReactElement;
  file: UploadFile;
  fileList: Array<UploadFile>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divElement: HTMLDivElement | undefined | null =
      ref.current?.querySelector(".ant-upload-list-item-name");

    if (divElement) {
      const { webkitRelativePath, name } = file as RcFile;
      const filePath = webkitRelativePath.split("/");
      // remove upper directory name
      filePath.shift();
      divElement.title = filePath.join("/") ?? name;
      divElement.innerHTML = filePath.join("/") ?? name;
    }
  }, []);

  return <div ref={ref}>{originNode}</div>;
});
