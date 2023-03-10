import { useState, useEffect, useRef } from 'react'
import { Tabs, Input, Button } from 'antd'
import AnotherTable from './components/AnotherTable'
import PrintableTable from './components/PrintableTable'
import CustomModal from './components/Modal'
import { dummyData } from "./assets/dummy"
import FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import jsPDF from 'jspdf'
import { useReactToPrint } from "react-to-print"

function App() {

  const [currentTabTitle, setCurrentTabTitle] = useState('Residential CC Cert Issued')
  const handleTabChange = (key) => {
    const currentTab = anotherTab.find(t => t.key === key)
    if (!currentTab) return
    const tabLabel = currentTab.label
    setCurrentTabTitle(tabLabel)

    console.log(key)
  }

  // Currently, there is only 1 dummy data (and 1 default column). 
  // Meaning, regardless of which Tab is opened, whatever is 
  // displayed in the current page of the table will be exported 
  // INCLUDING all the Object keys found in the dummy data.
  const handleExportExcel = async (fileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    console.log('handling export excel...')

    const innerHTML = document.querySelector('.test-data').innerHTML
    const currentTableData = JSON.parse(innerHTML)

    const ws = XLSX.utils.json_to_sheet(currentTableData)
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  // Currently, there is only 1 dummy data (and 1 default column). 
  // Meaning, regardless of which Tab is opened, whatever is 
  // displayed in the current page of the table will be exported 
  // INCLUDING all the Object keys found in the dummy data.
  const handleExportPdf = (fileName) => {
    const innerHTML = document.querySelector('.test-data').innerHTML
    const currentTableData = JSON.parse(innerHTML)

    require('jspdf-autotable')
    console.log('handing export pdf...')
    const report = new jsPDF('landscape', 'pt', 'a4');

    // get all the header columns of the table
    // do not include the "Tabe Operation" column
    const cols = defaultColumns.map(c => ({ title: c.title }))
    cols.pop()

    // Flatten each object's values
    // do not include the first element, "key"
    const temp = currentTableData.map(d => {
      const x = Object.values(d)
      x.shift()
      return x
    })

    const xOffset = report.internal.pageSize.width / 2
    report.text(currentTabTitle, xOffset, 8, { align: 'center' });
    report.autoTable({
      head: [cols],
      body: temp
    })
    report.save(fileName + '.pdf')
  }

  // currentData is initially empty. Once the user clicks the print button,
  // the currentData would be populated with whatever is in the current page
  // of the table. The <PrintableTable /> component would then contain those
  // information
  const [currentData, setCurrentData] = useState([])
  const isPrinting = useRef(false)
  const isFirstRender = useRef(true)
  const handlePrint = () => {
    console.log('handle printing...')
    const innerHTML = document.querySelector('.test-data')?.innerHTML
    if (!innerHTML) return
    const currentTableData = JSON.parse(innerHTML)
    setCurrentData(currentTableData)
    isPrinting.current = true
  }

  // Once the currentData gets populated (after pressing print button),
  // we need to run print() to print the <PrintableTable />. But do not
  // run this useEffect if it's the first render of the component, run
  // only if the currentData gets populated (after setState).  We also 
  // need the isPrinting ref because in development mode, useEffect 
  // always run twice, which executes the print() method, thus, we need
  // to print only if it's not the first render and we are printing.
  useEffect(() => {
    console.log(isFirstRender.current, 'hahaha')
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!isFirstRender.current && isPrinting.current) {
      print()
      isPrinting.current = false
    }
  
  // currentData needs to be a dependency for this useEffect because
  // when we click the print button, we populate the currentData with
  // value. So after populating, we have to execute this hook.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData])

  const print = useReactToPrint({
    content: () => {
      // this gets the reference for the table.
      // We can also create a custom table design,
      // we just need to get its <div> reference
      return document.querySelector('#table-content1')
    },
    pageStyle:"@page { size: landscape }",
    documentTitle: currentTabTitle,
  })

  // This is only appropriate for the dummy data
  // defaultColumns variable must be changed 
  // depending on the provided data
  const defaultColumns = [
    {
      title: 'Certificate Number',
      dataIndex: 'certificateNumber',
      editable: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b) => a.certificateNumber.localeCompare(b.certificateNumber),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      editable: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'MSSL',
      dataIndex: 'mssl',
      editable: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b) => a.mssl.localeCompare(b.mssl),
    },
    {
      title: 'Geneco Account Number',
      dataIndex: 'genecoAccountNumber',
      editable: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b) => a.genecoAccountNumber.localeCompare(b.genecoAccountNumber),
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      editable: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b) => a.contactNumber.localeCompare(b.contactNumber),
    },
    {
      title: 'Product Number',
      dataIndex: 'productNumber',
      editable: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b) => a.productNumber.localeCompare(b.productNumber),
    },
    {
      title: 'Certificate Issuance Date',
      dataIndex: 'certificateIssuanceDate',
      editable: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b) => new Date(a.certificateIssuanceDate) - new Date(b.certificateIssuanceDate),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      editable: true,
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      editable: true,
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: 'Total Quantity',
      dataIndex: 'totalQuantity',
      editable: true,
      sorter: (a, b) => a.totalQuantity - b.totalQuantity,
    },
    {
      title: 'Certificate',
      dataIndex: 'certificate',
      editable: true,
    },
    {
      title: 'Notification Email Sent To',
      dataIndex: 'notifiedEmail',
      editable: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b) => a.notifiedEmail.localeCompare(b.notifiedEmail),
    },
    {
      title: 'Table Operation',
      dataIndex: 'operation',
      editable: false,
    },
  ]

  // Tab used for the SECOND table
  const anotherTab = [
    {
      key: 1,
      label: 'Residential CC Cert Issued',
      children: <AnotherTable dummyData={dummyData} defaultColumns={defaultColumns}></AnotherTable>,
    },
    {
      key: 2,
      label: 'Residential REC Cert Issued',
      children: <AnotherTable dummyData={dummyData} defaultColumns={[...defaultColumns.slice(0, 10), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 3,
      label: 'Residential Cert Failed to Issue',
      children: <AnotherTable dummyData={dummyData} defaultColumns={[...defaultColumns.slice(0, 6), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 4,
      label: '(C&I) CC Cert Issued',
      children: <AnotherTable dummyData={dummyData} defaultColumns={[...defaultColumns.slice(0, 4), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 5,
      label: '(C&I) REC Cert Issued',
      children: <AnotherTable dummyData={dummyData} defaultColumns={[...defaultColumns.slice(0, 9), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 6,
      label: '(C&I) SG REC Cert Issued',
      children: <AnotherTable dummyData={dummyData} defaultColumns={[...defaultColumns.slice(0, 11), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 7,
      label: '(C&I) Cert Failed to Issue',
      children: <AnotherTable dummyData={dummyData} defaultColumns={[...defaultColumns.slice(0, 5), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 8,
      label: 'Ad-hoc Cert Issued',
      children: <AnotherTable dummyData={dummyData} defaultColumns={[...defaultColumns.slice(0, 7), defaultColumns[12]]}></AnotherTable>,
    }
  ]


  return (
    <div className="App">
      <h4>Row edit</h4>

      <div className='row mx-0'>
        <div className="col d-flex align-items-center justify-content-start">
          <h6 className='my-0 me-4'>Retirement Quantity</h6>
          <Input className='w-25' onInput={(e) => console.log(e.target.value)} />
        </div>
        <div className="col d-flex justify-content-end">
          <CustomModal currentTabTitle={currentTabTitle}></CustomModal>
          <Button className='ms-2 me-1' onClick={() => handleExportExcel('excelData')}>
            Export Excel
          </Button>
          <Button className='ms-1 me-2' onClick={() => handleExportPdf('pdfData')}>
            Export PDF
          </Button>
          <Button className='ms-1' onClick={() => handlePrint()}>
            Print
          </Button>
        </div>
      </div>

      <Tabs defaultActiveKey='1' items={anotherTab} onChange={handleTabChange}></Tabs>
      
      {/* This is a layout for the table that gets printed. We do not need to show this in the page.
          We also need to remove the last column of the defaultColumns as it is a Table Operation. 
          We do not want that to be included in the printable layout */}
      <PrintableTable defaultColumns={defaultColumns.slice(0, -1)} currentData={currentData} tableTitle={currentTabTitle}></PrintableTable>
    </div>
  )
}

export default App
