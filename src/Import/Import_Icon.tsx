import {
  ConsoleSqlOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/react";
import {
  Button,
  Col,
  Modal,
  Popover,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Upload,
} from "antd";
import {
  RcFile,
  UploadFile,
  UploadListType,
  ItemRender,
} from "antd/lib/upload/interface";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Import() {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"directory" | "files">("directory");
  const buttonRef = useRef<HTMLBRElement>(null);

  const debouncedChange = useDebouncedCallback(
    (index: number, value: string) => {},
    300
  );

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

  return (
    <>
      <Button onClick={openModal(true)}>Import</Button>
      <Modal
        visible={open}
        closable
        onCancel={openModal(false)}
        title="Import Files"
        width={500}
      >
        <div css={style}>
          <div className="select-section">
            <Radio.Group onChange={onChangeMode}>
              <Radio value="directory">Directory</Radio>
              <Radio value="files">Files</Radio>
            </Radio.Group>
          </div>
          <div className="upload-section">
            <Upload
              {...propsBefore}
              directory={mode === "directory"}
              // iconRender={uploadIconRender}
              itemRender={(originNode, file, currFileList) => {
                return (
                  <CustomItemRender
                    originNode={originNode}
                    file={file}
                    fileList={fileList}
                  />
                );
              }}
            >
              {mode === "directory" ? (
                <Button
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
                <Button icon={<UploadOutlined />}>Select Files</Button>
              )}

              <Popover content="Delete All Files">
                <Button icon={<DeleteOutlined />} type="dashed" />
              </Popover>
            </Upload>
          </div>
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
    /* .ant-upload-list.ant-upload-list-text {
      .ant-upload-list-item-info {
        .ant-upload-list-item-name {
          padding-left: 0;
        }
      }
    } */

    .ant-upload-list.ant-upload-list-text {
      overflow: auto;
      max-height: 30rem;
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
`;

const uploadIconRender = (file: UploadFile<any>, listType?: UploadListType) => {
  const fileInfo = file as RcFile;
  const filePath = fileInfo.webkitRelativePath.split("/");
  //remove file name
  filePath.shift();
  // remove upper directory name
  filePath.pop();
  const dirPath = filePath.length === 0 ? "" : filePath.join("/") + "/";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PaperClipOutlined style={{ marginRight: "0.5rem" }} />
      <div style={{ color: "gray" }}>{`${dirPath}`}</div>
    </div>
  );
};

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
