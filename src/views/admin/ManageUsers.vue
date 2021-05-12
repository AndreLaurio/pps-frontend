<template>
	<div class="pop ml-12 mt-12">
		<v-container>
			<div class="text-center font-poppins">
				<h1 class="mt-12">Manage Users</h1>
			</div>
			<div class="mt-12">
				<div class="text-right">
					<span class="green--text">{{ success.deleteUser }}</span>
					<span class="red--text">{{ errors.deleteUser }}</span>

					<v-btn 
						class="white--text text-capitalize ml-2"
						color="blue" 
						title="Create User"
						@click="createUser()">
						<v-icon>mdi-plus-box</v-icon> Create User
					</v-btn>
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
					:items="users"
					:loading="table.loading"
					:loading-text="table.loadingText"
					:options.sync="table.options"
					:search="table.search"
					class="elevation-1"
				>
					<template v-slot:item.no="{ item }">
						{{ item.no }}
					</template>

					<template v-slot:item.user_type="{ item }">
						<span class="red--text" v-if="item.user_type_id == 1">Admin</span>
						<span class="green--text" v-else-if="item.user_type_id == 2">Examiner</span>
						<span v-else>Examinee</span>
					</template>

					<template v-slot:item.actions="{ item }">
						<v-btn icon title="Edit Exam"
							@click="editUser(item)">
							<v-icon color="green">mdi-pencil</v-icon>
						</v-btn>

						<v-btn icon title="Delete Exam"
							@click="confirmDeleteUser(item)">
							<v-icon color="red">mdi-delete</v-icon>
						</v-btn>
					</template>
				</v-data-table>
				
				<!-- Delete Exam Dialog -->
				<v-dialog v-model="dialogs.deleteUser" width="700" persistent>
					<v-card>
						<v-card-title class="font-poppins justify-center">
							<h3
								class="header-color text-center mt-8"
							>
								Delete User
							</h3>
						</v-card-title>
						<v-card-text class="font-poppins">
							
							<div
								class="black--text text-center mt-3"
							>
								Do you want to continue?
							</div>

							<v-divider
								class="mt-8 primary ml-12 mr-12"
							></v-divider>

							<div class="mt-8 text-center mb-5">
								<v-btn
									small
									outlined
									color="primary"
									@click="dialogs.deleteUser = false"
									v-if="nos.deleteUser"
									class="pl-5 pr-5"
								>
									No</v-btn
								>
								<v-btn
									small
									class="ml-3 pl-5 pr-5"
									color="primary"
									:loading="loadings.deleteUser"
									@click="deleteUser()"
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
            users: [],
			user: {},
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
                        text: "Last Name",
                        value: "last_name",
                        align: "center",
                        class: "primary--text tblBackgroundHeader"
                    },
                    {
                        text: "First Name",
                        value: "first_name",
                        align: "center",
                        class: "primary--text tblBackgroundHeader"
                    },
                    {
                        text: "Email",
                        value: "email",
                        align: "center",
                        class: "primary--text tblBackgroundHeader"
                    },
                    {
                        text: "User Type",
                        value: "user_type",
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
                loadingText: "Loading users...",
                search: "",
                serverItemsLength: 1,
                options: {
                    page: 1,
                    itemsPerPage: 5
                },
                rowsPerPageItems: [5, 10, 20, 50]
            },
            dialogs: {
                deleteUser: false
            },
            loadings: {
                deleteUser: false,
            },
            success: {
                deleteUser: ''
            },
            errors: {
                deleteUser: ''
            },
            nos: {
                deleteUser: true
            }
        };
    },
    created() {
    },
    mounted() {
		this.loadUsers('options')
    },
    watch: {
    },
    methods: {
        loadUsers(by) {
            const params = this.getTableParams(by);

            this.table.loading = true;

            axios
                .get("/api/users", {
                    params: params
                })
                .then(response => {
					console.log('loadUsers')

                    if (response.data.code == 200) {
						console.log(response.data)
                        this.users = response.data.users.data;
                        this.table.serverItemsLength =
                            response.data.users.total;
                        this.table.options.page =
                            response.data.users.current_page;
                        this.table.options.itemsPerPage =
                            response.data.users.per_page;

                        // Add question no
                        var preNo = (this.table.options.page - 1) * this.table.options.itemsPerPage
                        for(var i = 0; i < this.users.length; i++) {
                            // Add exam no
                            this.users[i].no = preNo + i + 1
                        }
                    }
                })
                .catch(error => {
                    // Alert
                    console.log("Loading Users Failed!");
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
        confirmDeleteUser(user) {
            this.dialogs.deleteUser = true

            this.user = _.cloneDeep(user)
        },
        createUser() {
            this.$router.push({
                name: 'AdminCreateUser',
            });
        },
        editUser(user) {
            this.$router.push({
                name: 'AdminCreateUser',
                params: {
                    method: 'EDIT',
					user: user
                }
            })
        },
        deleteUser() {
            this.loadings.deleteUser = true
            this.success.deleteUser = ''
            this.errors.deleteUser = ''
            this.nos.deleteUser = false

            // Delete
            axios
                .delete(`api/users/${this.user.user_id}`)
                .then(response => {
                    if(response.data.code == 200) {
                        this.success.deleteUser = response.data.message
                        this.dialogs.deleteUser = false
                        this.loadUsers('options')
                    }
                })
                .catch(error => {
                    this.errors.deleteUser = error.response.data.message
                })
                .finally(() => {
                    this.loadings.deleteUser = false
                    this.nos.deleteUser = true
                    this.dialogs.deleteUser = false
                })
        },
    }
};
</script>
