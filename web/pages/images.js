import { Sidebar } from "../components/Sidebar";
export default function Images() {
  return <> Images </>;
}

Images.getLayout = function getLayout(page) {
  return (
    <>
      <Sidebar>
        {page}
      </Sidebar>
    </>
  )
}
