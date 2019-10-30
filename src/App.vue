<template>
  <div id="app">
    <component-to-re-render :key="componentKey" />
    
    <button @click="login()">  login</button>
    <p>{{this.out}}</p>
    <div v-if="!this.check">
      <button @click="callQueue()">  เรียกคิว</button>
      
    </div>
    <div v-if="this.check">
      <p>patientID : {{user.ID}}</p>
      <label>ขั้นตอนถัดไป</label>
      <input type="text" v-model="processName"/>
      <button @click="setProcess()">  ดำเนินการต่อ</button>
    </div>
  </div>
  
  
</template>

<script>
import {db} from './firebase'
// import { rtb } from '../../firestore-1/src/firebase'
const users = db.collection('user')
const departments = db.collection('department')
var staffRef,departmentRef
const processes = db.collection('process')
var temp

export default {
  data() {
    return {
      process : '',
      processName : 'X-ray',
      check : false,
      // documents : db.collection('wtf'),
      out:"",
      user : 'Nan',
      department : 'Nan',
      doctor : '',
      doctorID : 'OPD01',
      departmentName:'Out Patient Department',
      aaa : 0
    }
  },
  methods:{
    login(){
      departmentRef = departments.doc(this.departmentName)
      staffRef = departmentRef.collection('Doctors').doc(this.doctorID)
      
      this.$bind('department', departmentRef)
      this.$bind('doctor', staffRef).then(doctor => {
      this.out = doctor.ID 
      })
    },
    callQueue(){
      
      if(this.doctor.q_list.length == 0){
        temp = this.department.q_list.shift()
        this.doctor.q_call = 0
        this.doctor.q_run = 0
        ////////////////////////////////////////////
        ////////// อย่าลืมเปลี่ยนกลับ!!!!!//////////////
        ///////////////////////////////////////////
        // temp = this.department.q_list[0] //-------!!!!!!
        this.doctor.q_list.push(temp)
      }
      else{
        this.doctor.q_call += 1
      }
      this.department.q_call = this.doctor.q_list[0].queue
      // this.out = temp.queue
      temp = this.doctor.q_list[0]
      // this.out = this.department.q_list
      staffRef.set(this.doctor)
      departmentRef.set(this.department)
      // temp = this.doctor.ID
      this.check = true
      // this.out = 'wtf'
      this.$bind('user', users.doc(temp.userID)).then(user => {
        this.user === user
        this.out = this.user.name
        this.user.process_list[this.user.process_list.length-1].status = 'pass'
        this.user.process_list.push({name:this.doctorID,status:'0',type:'Out Patient Department'});
        ////////////////////////////////
        this.user.queueRef = 5
        this.user.queueRef = db.collection('department').doc('Out Patient Department').collection('Doctors').doc(this.doctorID)
        users.doc(temp.userID).set(this.user)
      })
      
      // users.doc(this.user.ID).set(this.user)
      // this.out = 11111
      
    },

    setProcess(){
      this.doctor.q_list.shift()
      staffRef.set(this.doctor)
      this.check = false
      this.out = 1
      this.$bind('process', processes.doc(this.processName)).then(process => {
        this.process === process
        this.process.q_run+=1
        this.process.q_list.push({ID:this.user.ID,queue:this.process.q_run})
        processes.doc(this.processName).set(this.process)
        this.out = this.process 
        this.out = 2
        this.user.process_list[this.user.process_list.length-1].status = 'pass'
        this.out = 1
        this.user.process_list.push({name:this.processName,status:this.process.q_run,type:'process'});
        this.out = this.process.name
        this.user.queueRef = db.collection('process').doc(this.processName)
        users.doc(this.user.ID).set(this.user)
          
      })
      
      
      // this.process = ''
      
    },

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
