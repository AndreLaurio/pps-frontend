<template>
	<div class="pop ml-12 mt-12">
		<v-container>
			<div class="text-center font-poppins">
				<h1 class="mt-12">Manage Exams</h1>
			</div>
			<div class="mt-12">
				<div class="text-right">
					<span class="green--text">{{ success.deleteExam }}</span>
					<span class="red--text">{{ errors.deleteExam }}</span>
				</div>
							
				<v-text-field
					v-model="table.search"
					prepend-inner-icon="mdi-magnify"
					label="Search"
					single-line
					hide-details
				></v-text-field>

				<br />

				<v-data-table
					:headers="table.headers"
					:items="exams"
					:loading="table.loading"
					:loading-text="table.loadingText"
					:options.sync="table.options"
					:search="table.search"
					class="elevation-1"
				>
					<template v-slot:item.no="{ item }">
						{{ item.no }}
					</template>

					<template v-slot:item.actions="{ item }">

						<v-btn icon title="Delete Exam"
							@click="confirmDeleteExam(item)">
							<v-icon color="red">mdi-delete</v-icon>
						</v-btn>
					</template>
				</v-data-table>
				
				<!-- Delete Exam Dialog -->
				<v-dialog v-model="dialogs.deleteExam" width="700" persistent>
					<v-card>
						<v-card-title class="font-poppins justify-center">
							<h3
								class="header-color text-center mt-8"
							>
								Delete Exam
							</h3>
						</v-card-title>
						<v-card-text class="font-poppins">
							
							<div
								class="black--text text-center mt-3"
							>
								All the examinees included in the exam and their answers will also be deleted. Do you want to continue?
							</div>

							<v-divider
								class="mt-8 primary ml-12 mr-12"
							></v-divider>

							<div class="mt-8 text-center mb-5">
								<v-btn
									small
									outlined
									color="primary"
									@click="dialogs.deleteExam = false"
									v-if="nos.deleteExam"
									class="pl-5 pr-5"
								>
									No</v-btn
								>
								<v-btn
									small
									class="ml-3 pl-5 pr-5"
									color="primary"
									:loading="loadings.deleteExam"
									@click="deleteExam()"
									dark
									>Yes</v-btn
								>
							</div>
						</v-card-text>
					</v-card>
				</v-dialog>
			</div>
		</v-container>


		<v-main>
			<AdminDashboard />
		</v-main>
	</div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
.pop {
	font-family: "Poppins", sans-serif;
}
.colored-title {
	color: #760d11;
}
</style>

<script>
import AdminDashboard from "@/components/admin/Dashboard";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
	components: {
		AdminDashboard,
	},
    data() {
        return {
            exams: [],
			exam: {},
            table: {
                headers: [
                    {
                        text: "#",
                        value: "no",
                        align: "center",
                        class: "primary--text tblBackgroundHeader",
                        sortable: false
                    },
                    {
                        text: "Title",
                        value: "exam_title",
                        align: "center",
                        class: "primary--text tblBackgroundHeader"
                    },
                    {
                        text: "Description",
                        value: "exam_desc",
                        align: "center",
                        class: "primary--text tblBackgroundHeader"
                    },
                    {
                        text: "Total Score",
                        value: "total_score",
                        align: "center",
                        class: "primary--text tblBackgroundHeader",
                        sortable: false,
                    },
                    {
                        text: "# of Examinees",
                        value: "examinees_count",
                        align: "center",
                        class: "primary--text tblBackgroundHeader",
                        sortable: false,
                    },
                    {
                        text: "Actions",
                        value: "actions",
                        align: "center",
                        class: "primary--text tblBackgroundHeader",
                        sortable: false,
                    },
                ],
                loading: false,
                loadingText: "Loading exams...",
                search: "",
                serverItemsLength: 1,
                options: {
                    page: 1,
                    itemsPerPage: 5
                },
                rowsPerPageItems: [5, 10, 20, 50]
            },
            dialogs: {
                deleteExam: false
            },
            loadings: {
                deleteExam: false,
            },
            success: {
                deleteExam: ''
            },
            errors: {
                deleteExam: ''
            },
            nos: {
                deleteExam: true
            }
        };
    },
    created() {
    },
    mounted() {
		this.loadExams('options')
    },
    watch: {
    },
    methods: {
        loadExams(by) {
            const params = this.getTableParams(by);

            this.table.loading = true;

            axios
                .get("/api/exams/all", {
                    params: params
                })
                .then(response => {
					console.log('loadExams')

                    if (response.data.code == 200) {
						console.log(response.data)
                        this.exams = response.data.exams.data;
                        this.table.serverItemsLength =
                            response.data.exams.total;
                        this.table.options.page =
                            response.data.exams.current_page;
                        this.table.options.itemsPerPage =
                            response.data.exams.per_page;

                        // Add question no
                        var preNo = (this.table.options.page - 1) * this.table.options.itemsPerPage
                        for(var i = 0; i < this.exams.length; i++) {
                            // Add exam no
                            this.exams[i].no = preNo + i + 1
                        }
                    }
                })
                .catch(error => {
                    // Alert
                    console.log("Loading exams Failed!");
					console.log(error)
					console.log(error.response.data)
                })
                .finally(() => (this.table.loading = false));
        },
        getTableParams(by) {
            if (by == "search") {
                return {
                    search: this.table.search,
                    page: 1,
                    per_page: this.table.options.itemsPerPage
                };
            } else if (by == "options") {
                return {
                    search: this.table.search,
                    page: this.table.options.page,
                    per_page: this.table.options.itemsPerPage,
                    sort_by: this.table.options.sortBy,
                    sort_desc: this.table.options.sortDesc
                };
            }
        },
        confirmDeleteExam(exam) {
            this.dialogs.deleteExam = true

            this.exam = _.cloneDeep(exam)
        },
        deleteExam() {
            this.loadings.deleteExam = true
            this.success.deleteExam = ''
            this.errors.deleteExam = ''
            this.nos.deleteExam = false

            // Delete
            axios
                .delete(`api/exams/${this.exam.exam_id}`)
                .then(response => {
                    if(response.data.code == 200) {
                        this.success.deleteExam = response.data.message
                        this.dialogs.deleteExam = false
                        this.loadExams('options')
                    }
                })
                .catch(error => {
                    this.errors.deleteExam = error.response.data.message
                })
                .finally(() => {
                    this.loadings.deleteExam = false
                    this.nos.deleteExam = true
                    this.dialogs.deleteExam = false
                })
        },
    }
};
</script>
