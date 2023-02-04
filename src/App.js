import SampleTable from './SampleTable';
import { Tabs } from 'antd';

function App() {

  const handleTabChange = (key) => {
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
    }
  ];



  const tabs = [
    {
      key: 1,
      label: 'Residential CC Cert Issued',
      children: <SampleTable defaultColumns={defaultColumns}></SampleTable>,
    },
    {
      key: 2,
      label: 'Residential REC Cert Issued',
      children: <SampleTable defaultColumns={[...defaultColumns.slice(0, 10)]}></SampleTable>,
    },
    {
      key: 3,
      label: 'Residential Cert Failed to Issue',
      children: <SampleTable defaultColumns={[...defaultColumns.slice(0, 6)]}></SampleTable>,
    },
    {
      key: 4,
      label: '(C&I) CC Cert Issued',
      children: <SampleTable defaultColumns={[...defaultColumns.slice(0, 4)]}></SampleTable>,
    },
    {
      key: 5,
      label: '(C&I) REC Cert Issued',
      children: <SampleTable defaultColumns={[...defaultColumns.slice(0, 9)]}></SampleTable>,
    },
    {
      key: 6,
      label: '(C&I) SG REC Cert Issued',
      children: <SampleTable defaultColumns={[...defaultColumns.slice(0, 11)]}></SampleTable>,
    },
    {
      key: 7,
      label: '(C&I) Cert Failed to Issue',
      children: <SampleTable defaultColumns={[...defaultColumns.slice(0, 5)]}></SampleTable>,
    },
    {
      key: 8,
      label: 'Ad-hoc Cert Issued',
      children: <SampleTable defaultColumns={[...defaultColumns.slice(0, 7)]}></SampleTable>,
    }
  ]


  return (
    <div className="App">
      <Tabs defaultActiveKey='1' items={tabs} onChange={handleTabChange}></Tabs>
    </div>
  );
}

export default App;
