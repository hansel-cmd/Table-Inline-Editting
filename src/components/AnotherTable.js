import { Form, InputNumber, Popconfirm, Table, Typography, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import { useState, useRef } from 'react';
import Highlighter from 'react-highlight-words'
import { dummyData } from "../assets/dummy"

const originData = [];
for (let i = 0; i < 100; i++) {
    originData.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const AnotherTable = ({ defaultColumns }) => {

    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([...dummyData]);
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const searchInput = useRef(null)
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;

    const handleEdit = (record) => {
        // use setFieldsValue to be able to validate fields when saving
        // use the href attribute for the certificate field because it
        // is an href object
        console.log(record) 
        form.setFieldsValue({
            ...record,
            certificate: record['certificate'].props?.href
        });
        setEditingKey(record.key);
    };

    const handleCancel = () => {
        setEditingKey('');
    };

    const handleSave = async (key) => {
        try {
            const row = await form.validateFields();
            console.log('values', row)
            // If the edited cell in the row is a link, then transform
            // the data to be saved
            if (row['certificate']) {
                row['certificate'] =  <a href={row['certificate']} target="_blank" rel="noreferrer">Link</a>
            }
            const newData = [...dataSource];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setDataSource(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setDataSource(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText((selectedKeys.length === 0 && '') || selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters, confirm, dataIndex) => {
        clearFilters()
        handleSearch([], confirm, dataIndex)
    }

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

    
    const columns = defaultColumns.map((col) => {
        // Column certificate doesnt need to have search filter
        if (col.dataIndex === 'certificate') {
            return col
        }
        
        // Add a search filter functionality
        const newCol = {
            ...col,
            ...getColumnSearchProps(col.dataIndex),
        }

        if (col.dataIndex !== 'operation') {
            return newCol
        }
        
        // Add edit and delete functionality under the column "operation"
        return {
            ...col,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => handleSave(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Typography.Link
                            onClick={handleCancel}
                            style={{
                                marginRight: 0,
                            }}
                        >
                            Cancel
                        </Typography.Link>
                    </span>
                ) : (
                    <span>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => handleEdit(record)} style={{'marginRight': '8px'}}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Do you want to remove this record?" onConfirm={() => handleDelete(record.key)}>
                            <Typography.Link>
                                Delete
                            </Typography.Link>
                        </Popconfirm>

                    </span>
                );
            },
        }
    })
    
    // Make the cell of each row editable
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const components = {
        body: {
            cell: EditableCell,
        },
    }

    return (
        <div style={{ 'overflowX': 'auto' }}>
            <Form form={form} component={false}>
            <Table
                components={components}
                bordered
                dataSource={dataSource}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    pageSize: 5,
                    onChange: handleCancel,
                }}
            />
        </Form>
        </div>
    );
};

export default AnotherTable;