<template>
    <div>
        <ExamineeProfile/>
        <v-main>
            <ExamineeDashboard/>
        </v-main>
    </div>
</template>

<script>
import ExamineeDashboard from '@/components/examinee/Dashboard'
import ExamineeProfile from '@/components/Profile'

export default {
    components:{
        ExamineeDashboard, ExamineeProfile
    }
}
</script>