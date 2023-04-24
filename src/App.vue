<template>
  <el-row :gutter="20">
      <el-col :span="4"><div class="grid-content ep-bg-purple" style="text-align:center;"/>
          <head-vue @headSkill= "headSkillAdd" :skillList="skillList" :allDecoList="allDecoList" :costSkillId="costSkillId"
          :lv0DecoList="lv0DecoList" :lv1DecoList="lv1DecoList" :lv2DecoList="lv2DecoList" :lv3DecoList="lv3DecoList" :lv4DecoList="lv4DecoList"
          v-if="dataDone"
          /></el-col>

      <el-col :span="4"><div class="grid-content ep-bg-purple" />
          <chest-vue @chestSkill= "chestSkillAdd" :skillList="skillList" :allDecoList="allDecoList" :costSkillId="costSkillId"
          :lv0DecoList="lv0DecoList" :lv1DecoList="lv1DecoList" :lv2DecoList="lv2DecoList" :lv3DecoList="lv3DecoList" :lv4DecoList="lv4DecoList"
          v-if="dataDone"
          />
          </el-col>

      <el-col :span="4"><div class="grid-content ep-bg-purple" />
          <arm-vue @armSkill= "armSkillAdd" :skillList="skillList" :allDecoList="allDecoList" :costSkillId="costSkillId"
          :lv0DecoList="lv0DecoList" :lv1DecoList="lv1DecoList" :lv2DecoList="lv2DecoList" :lv3DecoList="lv3DecoList" :lv4DecoList="lv4DecoList"
          v-if="dataDone"
          />
          </el-col>

      <el-col :span="4"><div class="grid-content ep-bg-purple" />
          <waist-vue @waistSkill= "waistSkillAdd" :skillList="skillList" :allDecoList="allDecoList" :costSkillId="costSkillId"
          :lv0DecoList="lv0DecoList" :lv1DecoList="lv1DecoList" :lv2DecoList="lv2DecoList" :lv3DecoList="lv3DecoList" :lv4DecoList="lv4DecoList"
          v-if="dataDone"
          />
          </el-col>

      <el-col :span="4"><div class="grid-content ep-bg-purple" />
          <leg-vue @legSkill= "legSkillAdd" :skillList="skillList" :allDecoList="allDecoList" :costSkillId="costSkillId"
          :lv0DecoList="lv0DecoList" :lv1DecoList="lv1DecoList" :lv2DecoList="lv2DecoList" :lv3DecoList="lv3DecoList" :lv4DecoList="lv4DecoList"
          v-if="dataDone"
          />
          </el-col>

      <el-col :span="4"><div class="grid-content ep-bg-purple" />
          <skillShow-vue :FatherMsg="total"/></el-col>
 </el-row>
  
</template>

<script>
// 这里导入其它文件  组件，工具，json文件，js插件，
//import  组件名称 from ' 组件路径'
// import { defineComponent } from '@vue/composition-api'
import HeadVue from './components/HeadVue.vue'
import ChestVue from './components/ChestVue.vue'
import ArmVue from './components/ArmVue.vue'
import WaistVue from './components/WaistVue.vue'
import LegVue from './components/LegVue.vue'
import SkillShowVue from './components/SkillShowVue.vue'

export default {
      //import 引入的组件需要注入到对象中才能使用
    components:{HeadVue, ChestVue, ArmVue, WaistVue, LegVue ,SkillShowVue ,
    },
    created() {
      this.initData();
    },
    data(){
      return {
        dataDone: false,
        allDecoList: [],//装饰品
        skillList: [],//全技能列表
        costSkillId: [  //sabcd  的ID
               { skillId:[1,6,7,8,12,23,24,48,49,50,51,55,132] },
               { skillId:[2,3,4,5,9,10,22,45,84,107,112,116,117,119,126,131,136,140,141] },
               { skillId:[11,25,26,27,30,31,37,38,61,87,91,103,104,108,120,114,115,122,124,125,127,128,130,134,139,138,145] },
               { skillId:[46,35,36,18,19,20,21,32,33,34,39,40,41,47,54,60,63,64,65,66,81,105,106,118,52,53,100,101,102,121,135] },
               { skillId:[93,42,13,14,15,16,17,43,44,56,57,58,59,62,72,73,74,75,76,77,78,85,88,89,90,92,96,97,98,99,123,129] },
           ],
        lv0DecoList:[],
        lv1DecoList:[],
        lv2DecoList:[],
        lv3DecoList:[],
        lv4DecoList:[],
        skillList :[],
        head:[],
        chest:[],
        arm:[],
        waist:[],
        leg:[],
        total:[],
      }
    },
    methods: {
      async initData(){
        var result = await this.axios.get('/mhrice.json').then(res => {
              //all技能名字
              res.data.player_skill_name_msg.entries.forEach((element,index) => {
                  if( index==0 ){
                      this.skillList.push({ id: 0, name: "none" });
                  }else{
                      this.skillList.push({ id: index, name: element.content[13] });
                  }
              });
              res.data.player_skill_name_msg_mr.entries.forEach((element,index) => {
                  this.skillList.push({ id: parseInt(index)+112, name: element.content[13] });
              });
              //all装饰品
              this.decoNameList = res.data.decorations_name_msg.entries;
              this.mrDecoNameList = res.data.decorations_name_msg_mr.entries;
              let decoTemp = { id: null , lv: null, name: null,skillId: null, skillLv: null };
              this.divDecoraton(0,decoTemp);
              this.divDecoraton(1,decoTemp);
              this.divDecoraton(2,decoTemp);
              this.divDecoraton(3,decoTemp);
              this.divDecoraton(4,decoTemp);
              res.data.decorations.param.forEach((item,index) => {
                  if (item.id!="None") {
                      let temp;
                      if( 'Deco' in item.id ){
                          temp = { id: item.id.Deco, lv: item.decoration_lv, name: this.decoNameList[item.id.Deco+1].content[13],
                                      skillId: item.skill_id_list[0].Skill+1, skillLv: item.skill_lv_list[0] };
                      }
                      else if( 'MrDeco' in item.id ){
                          //mr装饰品技能 mrname从200开始
                          temp = { id: item.id.MrDeco+200, lv: item.decoration_lv, name: this.mrDecoNameList[item.id.MrDeco].content[13],
                                        skillId: item.skill_id_list[0].Skill+1, skillLv: item.skill_lv_list[0] };
                      }
                      this.allDecoList.push(temp);
                      this.divDecoraton(parseInt(item.decoration_lv),temp);
                  }
              });
        });
        this.dataDone = true;
      },
      headSkillAdd(data){
          if (data!=undefined && data!=null  ) {
            this.head = data ;
            this.skillCompute();
          }
        },
      chestSkillAdd(data){
          if (data!=undefined && data!=null  ) {
            console.log("chest");
            console.log(data);
            this.chest = data ;
            this.skillCompute();
          }
        },
      armSkillAdd(data){
          if (data!=undefined && data!=null  ) {
            this.arm = data ;
            this.skillCompute();
          }
        },
      waistSkillAdd(data){
          if (data!=undefined && data!=null  ) {
            this.waist = data ;
            this.skillCompute();
          }
        },
      legSkillAdd(data){
          if (data!=undefined && data!=null  ) {
            this.leg = data ;
            this.skillCompute();
          }
        },
      skillCompute(){
        let temp = [];
        this.total = temp.concat(this.head, this.chest, this.arm, this.waist, this.leg ).filter(Boolean);
        console.log(this.total);
        let tempList2 = new Array();
        if (this.total.length>=1) { //数量大于等于1个，技能整合 有可能+1  -1
                let tempList= new Array();
                this.total.forEach(t => { //避免修改同一个array
                    tempList.push({ id: parseInt(t.id), level: parseInt(t.level) });
                });
                tempList2.push( { id: parseInt(tempList[0].id), name: this.skillList[parseInt(tempList[0].id)].name , level: parseInt(tempList[0].level) });
                tempList.splice(0,1);//删除，取一个先放到tempList2，然后计算合并 相同skll等级
                for (let index = 0; index < tempList.length; index++) {
                    let element = tempList[index];
                    let sumLevel = element.level;
                    let i=0;
                    for (  ; i < tempList2.length; i++) {
                        let item = tempList2[i];
                        if ( parseInt(element.id) == parseInt(item.id) ) { //合并重复技能的等级并且删除重复项，继续下次循环
                            sumLevel += item.level;
                            tempList2[i].level=sumLevel;
                            tempList.splice(index,1); --index;//改变了tempList长度，--index
                            break;
                        }else if (i==(tempList2.length-1)) { //i走完代表未重复，push，删除合入项
                            //console.log( this.skillList[parseInt(tempList[0].id)] );
                            tempList2.push({ id: element.id, name: this.skillList[parseInt(tempList[index].id)].name , level: element.level });//tempList2末尾添加新元素，++i防止与新元素对比
                            tempList.splice(index,1); 
                            --index,++i;//删除tempList【index】，--index继续本此index
                            break;
                        }
                    }
                }
            }else{  //0个或一个无须合并

            }
            this.total = tempList2.sort(function(a, b){return b.level - a.level});
      },
      divDecoraton(lv, item ){
           switch (lv) {
               case 0: this.lv0DecoList.push(item);  break;
               case 1: this.lv1DecoList.push(item);  break;
               case 2: this.lv2DecoList.push(item);  break;
               case 3: this.lv3DecoList.push(item);  break;
               case 4: this.lv4DecoList.push(item);  break;
               default: console.log("Error custom!!!!!!");
                   break;
           }
       },
    },
    
  }
</script>

<style>

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 10px;
}


</style>
