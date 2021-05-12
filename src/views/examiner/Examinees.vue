<template>
    <div>
        <h1>AdminExaminees</h1>
        <v-main>
            <ExaminerDashboard/>
        </v-main>
    </div>
</template>

<script>
import ExaminerDashboard from '@/components/examiner/Dashboard'

export default {
    components:{
        ExaminerDashboard
    }
}
</script>