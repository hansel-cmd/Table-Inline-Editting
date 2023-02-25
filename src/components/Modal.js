import { Button, Modal, Input, Select, DatePicker, InputNumber } from 'antd'
import { useState } from 'react'

const CustomModal = ({ currentTabTitle }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleOk = () => {
        setIsModalOpen(false)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }


    return (
        <>
            <Button type="primary" onClick={showModal}>
                Create New
            </Button>
            <Modal
                title={`Create new ${currentTabTitle}`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={500}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Submit
                    </Button>,
                ]}
            >
                <div className='py-4'>
                    <div className="mb-3 row">
                        <label for="field1" className="col-sm-2 col-form-label">Field1</label>
                        <div className="col-sm-10">
                            <Input id="field1" onInput={(e) => console.log(e.target.value)} />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label for="field2" className="col-sm-2 col-form-label">Field2</label>
                        <div className="col-sm-10">
                            <Input id="field2" onInput={(e) => console.log(e.target.value)} />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label for="field3" className="col-sm-2 col-form-label">Field3</label>
                        <div className="col-sm-10">
                                <Select className='w-100'>
                                    <Select.Option value="option1">Option 1</Select.Option>
                                    <Select.Option value="option2">Option 2</Select.Option>
                                    <Select.Option value="option3">Option 3</Select.Option>
                                    <Select.Option value="option4">Option 4</Select.Option>
                                </Select>
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label for="field4" className="col-sm-2 col-form-label">Field4</label>
                        <div className="col-sm-10">
                            <DatePicker id="field4" className='w-100'/>
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label for="field5" className="col-sm-2 col-form-label">Field5</label>
                        <div className="col-sm-10">
                            <InputNumber id="field5" className='w-100'/>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default CustomModal;