// import "./App.css";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Select } from "antd";
import "antd/dist/antd.css";
import { Link, Route, Routes } from "react-router-dom";
import "./App.scss";
import FileDownloadWhile from "./FileDownload//FileDownloadWhile";
import FileDownloadGenerator from "./FileDownload/FileDownloadGenerator";
import Import from "./Import";
import Log from "./Log";

function App() {
  return (
    <div className="App" css={style}>
      <nav>
        <Link to={"/import"}>Import</Link>
        <H_SPACE />
        <Link to={"/blobwhile"}>Blob While</Link>
        <H_SPACE />
        <Link to={"/blobgenerator"}>Blob Generator</Link>
        <H_SPACE />
        <Link to={"/log1"}>Log1</Link>
        <H_SPACE />
        <Link to={"/log2"}>Log2</Link>
      </nav>

      <Routes>
        <Route
          path="/import"
          element={
            <Layout>
              <h1>Custom Step File Upload</h1>
              <Import />
            </Layout>
          }
        />
        <Route
          path="/blobwhile"
          element={
            <Layout>
              <h1>Blob While</h1>
              <FileDownloadWhile />
            </Layout>
          }
        />
        <Route
          path="/blobgenerator"
          element={
            <Layout>
              <h1>Blob Generator</h1>
              <FileDownloadGenerator />
            </Layout>
          }
        />
        <Route
          path="/log1"
          element={
            <Layout>
              <h1>Log 1</h1>
              <Log />
            </Layout>
          }
        />
        <Route
          path="/log2"
          element={
            <Layout>
              <h1>Log 2</h1>
              <Log />
            </Layout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

const Layout = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: 2rem;
  flex-direction: column;
`;

const style = css`
  display: flex;
  align-items: flex-start;
  nav {
    display: flex;
    margin-left: 2rem;
    flex-direction: row;
  }
`;

export const H_SPACE = styled.div`
  width: 1rem;
`;
