<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, getCurrentInstance } from "vue";
import * as echarts from "echarts";
import utils from "../utils/cUtile";

let router = useRouter();
let route = useRoute();

// 页面树数据
let ipages = ref({ name: "pages", children: [] });

// 当前点中页面
let currentPage = ref("");
let myChart;

// 获取上下文
const { proxy } = getCurrentInstance();

/**
 * 解析page数据
 */
let serializePage = (pages) => {
    pages.forEach((page, index) => {
        index == 0 && (currentPage.value = page.ipageSetting.pageId);
        ipages.value.children.push({
            name: page.ipageSetting.pageId,
            collapsed: true,
            children: [
                {
                    name: "pageSetting",
                },
                {
                    name: "pageData",
                    children: page.ipageDataList.map((com) => {
                        return {
                            name: com.name,
                        };
                    }),
                },
                {
                    name: "pageFunction",
                    children: page.ipageFunctionList.map((com) => {
                        return {
                            name: com.name,
                        };
                    }),
                },
                {
                    name: "components",
                    children: page.icomponentList.map((com) => {
                        return {
                            name: com.schema.type,
                        };
                    }),
                },
            ],
        });
    });

    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.querySelector(".pagesView"));
    // 绘制图表
    myChart.setOption({
        backgroundColor: "#292929",
        toolbox: {
            show: true,
            orient: "vertical",
            top: "center",
            right: 10,
            itemSize: 30,
            itemGap: 30,
            showTitle: true,
            iconStyle: {
                borderColor: "#ffffff",
                borderWidth: 2,
            },
            feature: {
                myTool1: {
                    show: true,
                    title: "浏览",
                    icon: "path://M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z",
                    onclick: () => {
                        if (currentPage.value) {
                            let applicationId = route.query.applicationId;
                            const routeData = router.resolve({
                                name: "nestPage",
                                query: { applicationId, pageId: currentPage.value },
                            });
                            window.open(routeData.href, "_blank");
                        }
                    },
                },
                myTool2: {
                    show: true,
                    title: "编辑",
                    icon: "path://M507.73 109.1c-2.24-9.03-13.54-12.09-20.12-5.51l-74.36 74.36-67.88-11.31-11.31-67.88 74.36-74.36c6.62-6.62 3.43-17.9-5.66-20.16-47.38-11.74-99.55.91-136.58 37.93-39.64 39.64-50.55 97.1-34.05 147.2L18.74 402.76c-24.99 24.99-24.99 65.51 0 90.5 24.99 24.99 65.51 24.99 90.5 0l213.21-213.21c50.12 16.71 107.47 5.68 147.37-34.22 37.07-37.07 49.7-89.32 37.91-136.73zM64 472c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z",
                    onclick: () => {
                        if (currentPage.value) {
                            let applicationId = route.query.applicationId;
                            const routeData = router.resolve({
                                name: "canvas",
                                query: { applicationId, pageId: currentPage.value },
                            });
                            window.open(routeData.href, "_blank");
                        }
                    },
                },
            },
        },
        series: [
            {
                type: "tree",
                data: [ipages.value],
                top: "1%",
                left: "7%",
                bottom: "1%",
                right: "10%",
                symbolSize: 7,
                label: {
                    formatter: (params) => {
                        if (params.data.name == "pageSetting") {
                            return `{b|${params.data.name}}`;
                        } else if (params.data.name == "pageData") {
                            return `{c|${params.data.name}}`;
                        } else if (params.data.name == "pageFunction") {
                            return `{d|${params.data.name}}`;
                        } else if (params.data.name == "components") {
                            return `{e|${params.data.name}}`;
                        } else if (params.treeAncestors.length == 3) {
                            return `{a|${params.data.name}}`;
                        } else if (params.treeAncestors.length == 2) {
                            return `{f|${params.data.name}}`;
                        }
                    },
                    rich: {
                        a: {
                            borderWidth: 8,
                            borderColor: "#1989fa",
                            backgroundColor: "#1989fa",
                            borderRadius: 7,
                            position: "left",
                            verticalAlign: "middle",
                            align: "right",
                            fontSize: 14,
                            color: "#ffffff",
                        },
                        b: {
                            borderWidth: 7,
                            borderColor: "#9d19fa",
                            backgroundColor: "#9d19fa",
                            borderRadius: 7,
                            position: "left",
                            verticalAlign: "middle",
                            align: "right",
                            fontSize: 12,
                            color: "#ffffff",
                        },
                        c: {
                            borderWidth: 7,
                            borderColor: "#fa6e19",
                            backgroundColor: "#fa6e19",
                            borderRadius: 7,
                            position: "left",
                            verticalAlign: "middle",
                            align: "right",
                            fontSize: 12,
                            color: "#ffffff",
                        },
                        d: {
                            borderWidth: 7,
                            borderColor: "#12bc2c",
                            backgroundColor: "#12bc2c",
                            borderRadius: 7,
                            position: "left",
                            verticalAlign: "middle",
                            align: "right",
                            fontSize: 12,
                            color: "#ffffff",
                        },
                        e: {
                            borderWidth: 7,
                            borderColor: "#e941c5",
                            backgroundColor: "#e941c5",
                            borderRadius: 7,
                            position: "left",
                            verticalAlign: "middle",
                            align: "right",
                            fontSize: 12,
                            color: "#ffffff",
                        },
                        f: {
                            borderWidth: 9,
                            borderColor: "#1989fa",
                            backgroundColor: "#1989fa",
                            borderRadius: 6,
                            position: "left",
                            verticalAlign: "middle",
                            align: "right",
                            fontSize: 16,
                            color: "#ffffff",
                        },
                    },
                },
                lineStyle: {
                    color: "#434647",
                },
                leaves: {
                    itemStyle: {
                        color: "#434647",
                    },
                    label: {
                        position: "left",
                        verticalAlign: "middle",
                        align: "right",
                    },
                },
                animationDuration: 550,
                animationDurationUpdate: 750,
            },
        ],
    });
    // 注册事件
    myChart.on("mousedown", function (params) {
        currentPage.value = params.treeAncestors[2] ? params.treeAncestors[2].name : null;
    });
};

let gotoNew = () => {
    open("/canvas", "_blank");
};

onMounted(async () => {
    let routeQuery = route.query;
    // 拉取全部page
    let params = {
        db: "smartx-tpm",
        collection: "cfg-generic-page",
        filter: {
            "ipageSetting.applicationId": routeQuery.applicationId,
        },
    };
    let res = await proxy.$service.querySettings(params);
    if (res && res.success && res.content) {
        let config = res.content || [];
        console.log("全部页面====", config);
        serializePage(config);
    }

    new ResizeObserver(() => {
        myChart.resize();
    }).observe(document.querySelector(".manageContainer"));
});
</script>

<template>
    <div class="manageContainer">
        <div class="pageIndicator" v-if="currentPage">{{ currentPage }}</div>
        <!-- 显示当前已有页面，展示子属性，点击子属性直接进入编辑相应属性 -->
        <div class="pagesView"></div>
        <!-- 新建页面 -->
        <div class="add" @click="gotoNew">
            <font-awesome-icon icon="fas fa-plus-circle" />
            <span> NEW </span>
        </div>
    </div>
</template>
