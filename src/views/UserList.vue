<template>
    <el-table style="width: 100%;" height="100%" :data="tableData" border="true" >
        <el-table-column style="width: 100px;color: maroon" prop="name" label="名称" />
        <el-table-column style="width: 100px" prop="age" label="年龄"/>
        <el-table-column style="width: 100px" prop="gender" label="性别"/>
        <el-table-column style="width: 100px;" prop="date" label="时间"/>
        <el-table-column style="width: 100px;" prop="date" label="时间"/>
        <el-table-column style="width: 100px;" prop="date" label="时间"/>
        <el-table-column style="width: 100px;" prop="date" label="时间"/>
    </el-table>
</template>

<script>
    export default {
        name: "UserList",
        data() {
            return {
                    tableData: [
                        {
                            name: "名称",
                            age: 22,
                            gender: '男',
                            date: "2020-08-27 22:49"
                        },
                        {
                            name: "名称",
                            age: 22,
                            gender: '女',
                            date: "2020-08-27 22:49"
                        },
                        {
                            name: "名称",
                            age: 22,
                            gender: '女',
                            date: "2020-08-27 22:49"
                        }
                    ]
                }
            }


    }
</script>

<style scoped>

</style>