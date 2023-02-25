import { useState } from 'react'
import { Tabs } from 'antd'
import { Input } from 'antd'
import AnotherTable from './components/AnotherTable'
import CustomModal from './components/Modal'

function App() {

  const [currentTabTitle, setCurrentTabTitle] = useState('Residential CC Cert Issued')
  const handleTabChange = (key) => {
    const currentTab = anotherTab.find(t => t.key === key)
    if (!currentTab) return
    const tabLabel = currentTab.label
    setCurrentTabTitle(tabLabel)

    console.log(key)
  }

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
      children: <AnotherTable defaultColumns={defaultColumns}></AnotherTable>,
    },
    {
      key: 2,
      label: 'Residential REC Cert Issued',
      children: <AnotherTable defaultColumns={[...defaultColumns.slice(0, 10), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 3,
      label: 'Residential Cert Failed to Issue',
      children: <AnotherTable defaultColumns={[...defaultColumns.slice(0, 6), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 4,
      label: '(C&I) CC Cert Issued',
      children: <AnotherTable defaultColumns={[...defaultColumns.slice(0, 4), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 5,
      label: '(C&I) REC Cert Issued',
      children: <AnotherTable defaultColumns={[...defaultColumns.slice(0, 9), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 6,
      label: '(C&I) SG REC Cert Issued',
      children: <AnotherTable defaultColumns={[...defaultColumns.slice(0, 11), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 7,
      label: '(C&I) Cert Failed to Issue',
      children: <AnotherTable defaultColumns={[...defaultColumns.slice(0, 5), defaultColumns[12]]}></AnotherTable>,
    },
    {
      key: 8,
      label: 'Ad-hoc Cert Issued',
      children: <AnotherTable defaultColumns={[...defaultColumns.slice(0, 7), defaultColumns[12]]}></AnotherTable>,
    }
  ]


  return (
    <div className="App">
      <h4>Row edit</h4>

      
      <div className='row'>
        <div className="col-6 d-flex align-items-center justify-content-start">
          <h6 className='my-0 me-4'>Retirement Quantity</h6>
          <Input className='w-25' onInput={(e) => console.log(e.target.value)} />
        </div>
        <div className="col d-flex justify-content-end">
          <CustomModal currentTabTitle={currentTabTitle}></CustomModal>
        </div>
      </div>

      <Tabs defaultActiveKey='1' items={anotherTab} onChange={handleTabChange}></Tabs>
    </div>
  )
}

export default App
