<template>
    <div>
        <ExaminerHome/>
            <v-main>
                <ExaminerDashboard/>
            </v-main>
    </div>
</template>

<script>
import ExaminerHome from '@/components/examiner/Home'
import ExaminerDashboard from '@/components/examiner/Dashboard'

export default {
    data(){
        return{

        }
    },
    components:{
        ExaminerHome, ExaminerDashboard
    }
}
</script>