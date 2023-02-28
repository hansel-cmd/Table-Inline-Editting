import { Table } from "antd";

const PrintableTable = ({ defaultColumns, currentData, tableTitle }) => {

    return (
        <div className="d-none">
            <div id="table-content1">
                <h3 className="text-center mb-4">{tableTitle}</h3>
                <Table
                    bordered
                    dataSource={currentData}
                    columns={defaultColumns}
                    pagination={{
                        hideOnSinglePage: true
                    }}
                />
            </div>
        </div>
    );
}

export default PrintableTable;