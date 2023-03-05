import { Sidebar } from "../../components/Sidebar";


export default function Documents() {
  return <> documents </>;
}


// returning the sidebar layout with the documents component
Documents.getLayout = function getLayout(page) {
  return (<><Sidebar></Sidebar>{page}</>);
}