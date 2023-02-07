/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, useContext, createContext, useRef } from "react"
import { Form, Input, Table, Button, Space, Popconfirm } from 'antd'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'
import { dummyData } from "../assets/dummy"

const EditableContext = createContext(null)

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const form = useContext(EditableContext)
    useEffect(() => {
        if (editing) {
            inputRef.current.focus()
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing)
        // use setFieldsValue to be able to validate fields when saving
        // use the href attribute if the data is an href object
        form.setFieldsValue({
            [dataIndex]: record[dataIndex].props?.href || record[dataIndex],
        })
    }

    const save = async () => {
        try {
            const values = await form.validateFields()
            // If the edited column is a link, then transform
            // the data to be saved
            if (values['certificate']) {
                values['certificate'] =  <a href={values['certificate']} target="_blank" rel="noreferrer">Link</a>
            }
            toggleEdit()
            handleSave({
                ...record,
                ...values,
            })
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    let childNode = children
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        )
    }
    return <td {...restProps}>{childNode}</td>
}


const SampleTable = ({ defaultColumns }) => {

    const [dataSource, setDataSource] = useState([...dummyData])
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const searchInput = useRef(null)
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText((selectedKeys.length === 0 && '') || selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters, confirm, dataIndex) => {
        clearFilters()
        handleSearch([], confirm, dataIndex)
    }

    const handleSave = (row) => {
        console.log('row', row)
        const newData = [...dataSource]
        const index = newData.findIndex((item) => row.key === item.key)
        const item = newData[index]
        newData.splice(index, 1, {
            ...item,
            ...row,
        })
        setDataSource(newData)
    }

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
      };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100)
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    })

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    }

    const columns = defaultColumns.map((col) => {
        // Add a search filter functionality
        const newCol = {
            ...col,
            ...getColumnSearchProps(col.dataIndex),
        }

        // Column certificate doesnt need to have search filter
        if (col.dataIndex === 'certificate') {
            return col
        }

        // Add a delete operation to a column whose dataIndex
        // is an "operation"
        if (col.dataIndex === 'operation') {
            return {
                ...col,
                render: (_, record) => {
                    return (
                    <Popconfirm title="Do you want to remove this record?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                    )
                }
            }
        }

        if (!col.editable) {
            return newCol
        }

        // If the column is editable, i.e., editable attribute is true,
        // add an onCell attribute that sets new props to the cells
        // of that column.
        return {
            ...newCol,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        }
    })


    return (
        <div style={{ 'overflowX': 'auto' }}>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={{pageSize: 5}}
            />
        </div>
    )
}

export default SampleTable