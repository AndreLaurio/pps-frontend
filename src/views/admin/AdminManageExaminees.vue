<template>
    <div class="pop ml-12 mt-12">
        <h2 class="mt-12 ml-12">Manage Examinees</h2>
        <p class="ml-12">{{exam_title}}</p>
        <v-layout justify-center>
            <v-flex xs12 sm12 xl10 md10>
                <div class="text-center mr-12">
                    <v-progress-circular v-if="loading == true"
                        :rotate="90"
                        :size="100"
                        :width="15"
                        :value="value"
                        color="red"
                        >
                        {{ value }}
                    </v-progress-circular>
                </div>
                <div class="mt-6">
                    <v-alert v-model="success.show" transition="fade-transition" type="success">
                        {{success.message}}
                    </v-alert>
                    <v-alert v-model="error.show" transition="fade-transition"  type="error">
                        {{error.message}}
                    </v-alert>
                    <v-data-table
                        v-if="loading == false"
                        :headers="headers"
                        :items="exam_examinees"
                        class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat color="white">
                                <v-dialog v-model="addExamineeDialog.show">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                            @click="getExaminees"
                                        >Add Examinee</v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">{{ addExamineeDialog.title }}</span>
                                        </v-card-title>

                                        <v-card-text>
                                            <v-container>
                                                <v-alert v-model="addExamineeDialog.success.show" transition="fade-transition" type="success">
                                                    {{addExamineeDialog.success.message}}
                                                </v-alert>
                                                <v-alert v-model="addExamineeDialog.error.show" transition="fade-transition"  type="error">
                                                    {{addExamineeDialog.error.message}}
                                                </v-alert>
                                                <v-card-title>
                                                    <v-text-field
                                                        v-model="addExamineeDialog.search"
                                                        append-icon="mdi-magnify"
                                                        label="Search"
                                                        single-line
                                                        hide-details
                                                    ></v-text-field>
                                                </v-card-title>

                                                <v-data-table
                                                    :headers="addExamineeDialog.headers"
                                                    :items="examinees"
                                                    :search="addExamineeDialog.search"
                                                    class="elevation-1"
                                                >
                                                    <template v-slot:item="ex">
                                                        <tr>
                                                            <td>
                                                                {{ex.item.last_name}}
                                                            </td>
                                                            <td>
                                                                {{ex.item.first_name}}
                                                            </td>
                                                            <td class="text-center">
                                                                {{ex.item.email}}
                                                            </td>
                                                            <td class="text-center">
                                                                <v-btn class="mx-2 error" small @click="addExaminee(ex.item.user_id, ex.item)"><v-icon>mdi-plus</v-icon> Add</v-btn>
                                                            </td>
                                                        </tr>
                                                    </template>
                                                </v-data-table>

                                            </v-container>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeAddExamineeDialog">Close</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>

                        <template v-slot:item="examinee">
                            <tr>
                                <td>
                                    {{examinee.item.last_name}}
                                </td>
                                 <td>
                                    {{examinee.item.first_name}}
                                </td>
                                <td class="text-center">
                                    {{examinee.item.email}}
                                </td>
                                <td class="text-center">
                                    {{examinee.item.exam_status}}
                                </td>
                                <td class="text-center">
                                    <v-btn class="mx-2 error" small @click="removeExamineeConfirm(examinee.item.user_id, examinee.item)"><v-icon>mdi-delete</v-icon> Remove</v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>

                    <v-container>
                        <v-dialog v-model="delExamineeDialog.show" persistent max-width="290">
                            <v-card>
                                <v-card-title class="pop"><h3>Remove Examinee</h3></v-card-title>
                                <v-card-text>{{delExamineeDialog.message}}</v-card-text>
                                <v-card-text>Are you sure to remove the examinee from the exam?</v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" text @click="delExamineeDialog.show = false">No</v-btn>
                                <v-btn color="primary" text @click="delExaminee()">Yes, continue</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-container>
                </div>
            </v-flex>
        </v-layout>
        <v-main>
            <AdminDashboard/>
        </v-main>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
.pop{
    font-family: 'Poppins', sans-serif;
}
.colored-title {
    color: #760D11;
}
</style>

<script>
import AdminDashboard from '@/components/admin/AdminDashboard'
import axios from 'axios'
 
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

export default {
    components:{
        AdminDashboard
    },
    props: {
        exam_id: {
            type: Number,
            default: 0
        },
        exam_title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            exam_examinees: [],
            examinees: [],
            headers:[
                {text: 'Surname'},
                {text: 'First Name'},
                {text: 'Email', align:'center'},
                {text: 'Status', align:'center'},
                {text: 'Actions', align: 'center'}
            ],
            success: {
                show: false,
                message: ''
            },
            error: {
                show: false,
                message: ''
            },
            addExamineeDialog: {
                show: false,
                title: 'Add Examinee',
                search: '',
                headers:[
                    {text: 'Surname'},
                    {text: 'First Name'},
                    {text: 'Email', align:'center'},
                    {text: 'Actions', align: 'center'}
                ],
                success: {
                    show: false,
                    message: ''
                },
                error: {
                    show: false,
                    message: ''
                }
            },
            delExamineeDialog: {
                show: false,
                message: '',
                user_id: '',
                item: {}
            },
            loading:true,
            interval: {},
            value: 0,
        }
    },
    mounted() {
        this.getExamExaminees()
        this.loadingButton()
    },
    beforeDestroy () {
        clearInterval(this.interval)
    },
    methods:{
        getExamExaminees() {
            if (this.exam_id == 0) {
                this.$router.push({ name: 'AdminExamination' })
            }
            else {
                axios.get(`/api/exam/examinees/${this.exam_id}`).then((response) => {
                    this.exam_examinees = response.data
                    this.loading = false
                }).catch((error) => {
                    console.log('Call the Administrator')
                })
            }
        },
        getExaminees() {
            axios.get(`/api/exam/examinees/not/${this.exam_id}`).then((response) => {
                this.examinees = response.data
            }).catch((error) => {
                console.log(error.respose.data)
            })
        },
        removeExamineeConfirm(user_id, item) {
            
            var message = '';

            if (item.exam_status == 'ONGOING') {
                message = 'The examinee is currently taking the exam.'
            }
            else if (item.exam_status == 'FINISHED') {
                message = 'The examinee already finished the exam.'
            }

            this.delExamineeDialog.message = message
            this.delExamineeDialog.user_id = user_id
            this.delExamineeDialog.item = item
            this.delExamineeDialog.show = true
        },
        delExaminee() {
            this.removeExaminee(this.delExamineeDialog.user_id, this.delExamineeDialog.item)
            this.delExamineeDialog.show = false
        },
        removeExaminee(user_id, item) {

            axios.post('/api/exam/examinee/delete', {
                'user_id': user_id,
                'exam_id': this.exam_id,
            }).then((response) => {

                var index = this.exam_examinees.indexOf(item)
                this.exam_examinees.splice(index, 1)

                this.success.message = 'Examinee is successfully removed.'
                this.success.show = true
                this.error.show = false

            }).catch((error) => {
                console.log('Call the Administrator')
            })
        },
        addExaminee(user_id, item) {
            axios.post('/api/exam/examinee/add', {
                'user_id': user_id,
                'exam_id': this.exam_id,
            }).then((response) => {

                if (response.data.status == 'success') {

                    this.exam_examinees.push({
                        'user_id': item.user_id,
                        'last_name': item.last_name,
                        'first_name': item.first_name,
                        'email': item.email,
                        'exam_status': 'NONE',
                        'exam_status_code': 'N'
                    })

                    var index = this.examinees.indexOf(item)
                    this.examinees.splice(index, 1)

                    this.addExamineeDialog.success.message = response.data.message
                    this.addExamineeDialog.success.show = true
                }
                else {
                    this.addExamineeDialog.error.message = response.data.message
                    this.addExamineeDialog.error.show = true
                }

            }).catch((error) => {
                console.log('Call the Administrator')
            })
        },
        closeAddExamineeDialog() {
            this.addExamineeDialog.show = false
            this.addExamineeDialog.success.show = false
            this.addExamineeDialog.error.show = false
        },
        loadingButton(){
            this.interval = setInterval(() => {
                if (this.value === 100) {
                    return (this.value = 0)
                }
                this.value += 10
            }, 1000)
        },
    }
}
</script>