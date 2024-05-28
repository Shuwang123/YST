<template>
    <!-- 打印的药方，弄成组件，形成复用 -->
    <div :id="idName" class="print-container box-shadow">
        <!-- 循环开始 -->
        <section class="print_page" v-for="index in pages" :key="index"> 
            <div class="view_head">
                <div class="ibox_hospital">重庆渝北一善堂中医门诊部</div>
                <div class="ibox_order" style="font-size: 13px;">
                    <div class="order_no">单据号：Y0039579</div>
                    <div class="order_time">收费时间：2024-05-28 12:00:00</div>
                </div>
                <div class="ibox_user" style="font-size: 13px;">
                    <div class="user_name">姓名：胡捷</div>
                    <div class="user_name">性别：女</div>
                    <div class="user_name">年龄：100岁</div>
                    <div class="user_cost">费别：普通</div>
                    <div class="user_dept">开单科室：中医科</div>
                </div>
            </div>
            <table class="view_table" border="1" width="100%">
                <tbody>
                <tr style="font-size: 12px">
                    <td height="16">序号</td>
                    <td>类别</td>
                    <td>项目</td>
                    <td>单位</td>
                    <td>数量</td>
                    <td>单价</td>
                    <td>应收</td>
                    <td>执行部门</td>
                </tr>
                <tr v-for="(item, ind) in data.SaleOrderItems.slice((index - 1) * 30, (index * 30))"
                    style="font-size: 12px" :key="`${index}${ind}`">
                    <td width="50" height="16">{{ind + (index - 1) * 30 + 1}}</td>
                    <td width="70">{{item.type}}</td>
                    <td width="100" align="center">{{item.name}}</td>
                    <td width="70" align="center">{{item.Unit}}</td>
                    <td width="50">{{item.Quantity}}</td>
                    <td width="50" align="right">{{item.Price}}</td>
                    <td width="70" align="right">{{item.Price}}</td>
                    <td width="100">{{item.dept}}</td>
                </tr>
                </tbody>
            </table>
            <div class="view_foot" style="font-size: 13px;">
                <div class="total_money">应收合计：100.00元</div>
                <div class="total_member">收费员：孙娟娟</div>
                <div class="page_number">第 {{index}} 页，共 {{pages}} 页</div>
            </div>
            <div style="page-break-after: always"></div>
        </section>
    </div>
</template>
<script>
import { styles } from "./styles";
export default {
    name: "XPrintTmp",
    props: {
        idName: {
            required: true,
            type: String,
            default: "printwrap",
        },
        data: {
            required: true,
            type: Object, 
            default: {
                SaleOrderItems: []
            },
        },
    },
    data() {
        return {}
    },
    computed: {
        // 打印循环 相关参数
        pages: function() {
            let lists = this.data.SaleOrderItems;
            let value = parseInt(lists.length / 30 + 1) // 循环打印相关参数
            if (lists.length !== 0 && (lists.length % 30) === 0) {
                value-- // 针对刚好10条那种
            }
            return value;
        }
    },
    methods: {
        handlePrint() {
            this.$nextTick(() => {
                this.$printJS({
                    printable: this.idName, 
                    type: "html",
                    targetStyles: ["*"],
                    maxWidth: 500,
                    css: "",
                    scanStyles: false,
                    style: styles, // 亦可使用引入的外部css;
                })
            })
        },
        // 金额转中文大写
        // sumChinese(n) {
        //     if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法'
        //     var unit = '千百拾亿千百拾万千百拾元角分'
        //     var str = ''
        //     n += '00'
        //     var p = n.indexOf('.')
        //     if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2)
        //     unit = unit.substr(unit.length - n.length)
        //     for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
        //     return str.replace(/零(千|百|拾|角)/g, '零')
        //         .replace(/(零)+/g, '零')
        //         .replace(/零(万|亿|元)/g, '$1')
        //         .replace(/(亿)万|壹(拾)/g, '$1$2')
        //         .replace(/^元零?|零分/g, '')
        //         .replace(/元$/g, '元整')
        // },
    },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>