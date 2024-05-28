export const styles = `@page {}
@media print { 
    .ibox_hospital {
        text-align: center;
        font-size: 18px;
        font-weight: 900;
    }
    .ibox_order {
        margin-top: 10px;
        display: flex;
        align-items: center;
    }
    .ibox_order .order_no { flex: 1; }

    .ibox_user {
        margin-top: 10px;
        display: flex;
        align-items: center;
    }
    .ibox_user .user_name { margin-right: 15px; }
    .ibox_user .user_cost { flex: 1; }

    .view_table {
        margin-top: 10px;
        border-collapse: collapse;
        box-sizing: border-box;
    }
    .view_table tbody {
        text-align: center;
        line-height: 16px;
    }

    .view_foot {
        display: flex;
        align-items: center;
        margin-top: 10px;
    }
    .view_foot .total_money { margin-right: 15px; }
    .view_foot .total_member { flex: 1; }
}`