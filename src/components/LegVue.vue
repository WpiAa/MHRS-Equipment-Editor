<template>
    <!-- 选择装备 -->
    <div class="flex flex-wrap items-center" style="margin-left:20px">
            <el-button type="primary" @click="chooseDialogVisible = true">
                <span id="selectedHead" v-text="head"></span>
            </el-button>
    </div>

    <el-dialog
        v-model="chooseDialogVisible"
        title="头部"
        width="50%"
        :before-close="handleClose"
   >
        <el-input
            v-model="input2"
            class="w-50 m-2"
            placeholder="Please Input"
            
        />
        <el-scrollbar height="400px" style="margin-top: 20px">
            <div v-for="item in searchSum" :key="item" style="margin-top:10px">
                <el-button v-for="item1 in 5" :key="item1"  style="width: 18%" @click="chooseHead((item-1)*5+(item1-1))">
                    <!-- {{ filterArmorNameEntries[ (item-1)*5+(item1-1) ].content[13] }} -->
                    {{ filterArmorNameEntries[(item-1)*5+(item1-1)].content[13] }}
                </el-button>
            </div>
        </el-scrollbar>
        
    </el-dialog>




<!-- 装备技能表格 -->
    <div style="margin-top: 10px;margin-left:20px;padding-bottom: 10px">
        <div v-for="item in armorSkill" :key="item" class="text item" style="width:100%;">{{ 'Lv:'+item.level+ ' '+item.name}}</div>
    </div>

<!-- 装饰品 -->
    <div style="margin-bottom:10px;margin-left:20px;">
        <div><span >装饰品:</span></div>
        <div>
            <span style="font-family:Hiragino Sans GB;padding-top: 20px">Lv{{ armorDecorationsNow[0] }}:&nbsp;&nbsp;&nbsp;</span>
            <el-button size="small"  round @click="showDecorations(0,armorDecorationsNow[0])">
                {{ deco[0].decoName }} 
            </el-button>
        </div>
        <div>
            <span style="font-family:Hiragino Sans GB;padding-top: 20px">Lv{{ armorDecorationsNow[1] }}:&nbsp;&nbsp;&nbsp;</span>
            <el-button size="small"  round @click="showDecorations(1,armorDecorationsNow[1])">
                {{ deco[1].decoName }} 
            </el-button>
        </div>
        <div>
            <span style="font-family:Hiragino Sans GB;padding-top: 20px">Lv{{ armorDecorationsNow[2] }}:&nbsp;&nbsp;&nbsp;</span>
            <el-button size="small"  round @click="showDecorations(2,armorDecorationsNow[2])">
                {{ deco[2].decoName }} 
            </el-button>
        </div>
    </div>

    <el-dialog
        v-model="decorationDialogVisible"
        title="装饰品"
        width="50%"
        :before-close="handleDecorationClose"
   >
        <el-input
            v-model="input3"
            class="w-50 m-2"
            placeholder="Please Input"
            
        />
        <el-scrollbar height="400px" style="margin-top: 20px">
            <div v-for="item in decoSum" :key="item" style="margin-top:10px">
                <el-button v-for="item1 in 5" :key="item1"  style="width: 18%" @click="chooseDecoration((item-1)*5+(item1-1))">
                    {{ showDecoList[(item-1)*5+(item1-1)].name }}
                </el-button>
            </div>
        </el-scrollbar>
        
    </el-dialog>


<!-- 怪异化词条 -->
    <span style="font-family:Hiragino Sans GB;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cost:</span>
    <span style="font-family:Hiragino Sans GB;">10</span>
    <div class="example-block" style="text-align:center;">
        <el-cascader v-for="o in 7" :key="o" 
        v-model="selectVal[o-1]"
        :options="options"
        :props="cascaderProps"
        @change="handleChange"
        style="magin-top:10px"
        />
    </div>



<!-- 技能总和 -->
    <div style="margin-top: 20px">
        <el-card class="box-card">
            <div v-for="item in skillComputeList" :key="item" class="text item" style="width:100%;">
                {{ 'Lv:'+item.level+ ' '+item.name}}
            </div>
        </el-card>
    </div>
    
</template>

<script>
// 这里导入其它文件  组件，工具，json文件，js插件，
//import  组件名称 from ' 组件路径'
// import { defineComponent } from '@vue/composition-api'
import { ArrowDown } from '@element-plus/icons-vue'
// import { Search } from '@element-plus/icons-vue'
export default {
    //import 引入的组件需要注入到对象中才能使用
   components:{ArrowDown},
   emits:['legSkill'],
   props:[
       'skillList', 'allDecoList', 'costSkillId','lv0DecoList' ,'lv1DecoList' ,'lv2DecoList' ,'lv3DecoList' , 'lv4DecoList' ,
   ],
   mounted() {
        this.axios.get('/mhrice.json').then(res => {     // 获取public下的test.json文件数据
            //大师头盔名字列表
            this.armor_head_name_msg_mr = res.data.armor_leg_name_msg_mr;
            // this.NowArmor_head_name_msg_mr=res.data.armor_head_name_msg_mr;
            this.filterArmor(this.armor_head_name_msg_mr.entries);
            //头盔具体信息
            res.data.armor.param.forEach(element => {
                if( 'Head' in element.pl_armor_id ){
                    this.headDetail.push(element);
                }
            });
            //根据cost排列分类数据   可以+的sabcd类型
            this.costSkillId.forEach((e,index) => {
                e.skillId.forEach(element => {
                    this.options[0].children[index].children.push({     value: this.skillList[element].id,//二层值,id
                                                                        label: this.skillList[element].name , } )
                    });
            });
            //可以-的skill

        })
   },
   data() {
       return {
           notifyFather: true,
           input3: null,
           chooseFlag: false,
           skillComputeList: [],  //最终技能列表
           skillComputeFlag: true,
           cost: 10,
           // s a b c的ID
           /* costSkillId: [  //sabcd  的ID
               { skillId:[1,6,7,8,12,23,24,48,49,50,51,55,132] },
               { skillId:[2,3,4,5,9,10,22,45,84,107,112,116,117,119,126,131,136,140,141] },
               { skillId:[11,25,26,27,30,31,37,38,61,87,91,103,104,108,120,114,115,122,124,125,127,128,130,134,139,138,145] },
               { skillId:[46,35,36,18,19,20,21,32,33,34,39,40,41,47,54,60,63,64,65,66,81,105,106,118,52,53,100,101,102,121,135] },
               { skillId:[93,42,13,14,15,16,17,43,44,56,57,58,59,62,72,73,74,75,76,77,78,85,88,89,90,92,96,97,98,99,123,129] },
           ], */
           costSkillList: [],
           costDecoration_lv: 0,
           //选择的保留数据 和 展示数据
           armor_head_name_msg_mr: {},
           filterArmorNameEntries: [],
           chooseIndex: 0,
           headIndexInJson: 0,
           head: "头部装备",
        //    numArmor_head_name_msg_mr: 0,
           armorList:[],
           NowArmor_head_name_msg_mr: {},
           NowNumArmor_head_name_msg_mr: 0,
           input2: "",
           chooseDialogVisible: false,
           headId: '',
           headDetail: [],//全头盔信息列表
           skillObject: {id:'' ,name: ""},
        //    skillList: [],//全技能列表
           armorSkill: [],
           armorDecorationsNow: [],//目前装饰孔位等级 【4，4，1】【4，3，0】
           armorDecorationsNow2: [],//保存   目前装饰孔位等级 【4，4，1】【4，3，0】
           //装饰品
        //    allDecoList: [],
           decoNameList: [],
           mrDecoNameList: [],
        //    lv0DecoList:[],
        //    lv1DecoList:[],
        //    lv2DecoList:[],
        //    lv3DecoList:[],
        //    lv4DecoList:[],
           deco: [ { decoId:0 , decoName: "" }, { decoId:0 , decoName: "" }, { decoId:0 , decoName: "" } ],//展示珠子
           decoAllSkill: [null, null, null],//选择的珠子技能
        //    deco1: { decoId:0 , decoName: "" }, deco2: { decoId:0 , decoName: "" }, deco3: { decoId:0 , decoName: "" }, 
           decorationDialogVisible: false,
           slotLv: 0,
           decoFlag: -1,
           showDecoList: [],
           //怪异化
           customAllSkill: [],
           selectVal:[ ["None"],["None"],["None"],["None"],["None"],["None"],["None"]],
           cascaderProps:{
               expandTrigger: 'hover',
               size: 'small',
           },
           options:[
               {
                    value: '+skill',//一层值s
                    label: '+技能',//展示值
                    children:[
                            {   value: -15,//一层值
                                label: 'S skill',//展示值
                                children:[
                                        // {   value: '1',//二层值,id
                                        //     label: '攻击', }, //展示值,name
                                    ]},  
                            {   value: -12,
                                label: 'A skill',
                                children:[]},  
                            {   value: -9,
                                label: 'B skill',
                                children:[]}, 
                            {   value: -6,
                                label: 'C skill',
                                children:[]},  
                            {   value: -3,
                                label: 'D skill',
                                children:[]
                            }]
               },
               {
                    value: '-skill',//一层值s
                    label: '-技能',//展示值
                    children:[]
               },
               {
                    value: '+decoration_lv',
                    label: '+孔位',
                    children:[
                        {   value: -18,
                            label: '+3孔',
                            children:[]},  
                        {   value: -12,
                            label: '+2孔',
                            children:[]}, 
                        {   value: -6,
                            label: '+1孔',
                            children:[]}, 
                    ]
               },
               {
                    value: 'None',
                    label: 'None',
               }  
           ],


       }
   },
   //方法集合
   methods: {
       chooseHead(index){
           this.armorSkill=[],this.armorDecorationsNow=[];// 先清空上次
           this.options[1].children=[];this.costSkillList=[]; //清空 可减去的skill、cost已选择的
           //选择装备,保存index
           this.chooseIndex=index;
           this.head = this.filterArmorNameEntries[index].content[13];
           this.headId = parseInt(this.filterArmorNameEntries[index].name.split('_')[2]);
           this.headDetail.forEach(element => {
               //找出对应头盔并记录
               if( element.pl_armor_id.Head == parseInt(this.headId) ){
                   //技能 技能等级
                   element.skill_list.forEach((element1, index) => {
                       if (element1!="None") {
                           if ('Skill' in element1) {
                                this.armorSkill.push(  
                                    {id: parseInt(element1.Skill+1), name: this.skillList[element1.Skill+1].name, level: element.skill_lv_list[index]});
                                this.options[1].children.push( //放到可cost的技能
                                    {value: parseInt(element1.Skill+1), label: this.skillList[element1.Skill+1].name, level: element.skill_lv_list[index]});                     
                            }
                            if ('MrSkill' in element1) {
                                this.armorSkill.push(
                                    {id: parseInt(element1.MrSkill)+112, name: this.skillList[element1.MrSkill+112].name ,level: element.skill_lv_list[index]});
                                this.options[1].children.push(
                                    {value: parseInt(element1.MrSkill)+112, label: this.skillList[element1.MrSkill+112].name ,level: element.skill_lv_list[index]});
                            }
                       }
                   });
                   //装备孔位等级
                   for (let index = element.decorations_num_list.length-1; index >= 0; index--) {
                       let element1 = element.decorations_num_list[index];
                       if ( parseInt(element1) !=0 ) {
                           let i=0;
                           while ( i<element1 ) {
                               this.armorDecorationsNow.push(index+1);
                               i++;
                           }
                       }
                   }
                   while(this.armorDecorationsNow.length<3){
                       this.armorDecorationsNow.push(0);
                   }
                   this.armorDecorationsNow2 = this.armorDecorationsNow.concat();
               }
           });
           this.chooseFlag = true;
           if(index==0){
               //未选择或者清空选择
               this.armorSkill=[],this.armorDecorationsNow=[];// 清空上次
               this.options[0].children=[];
               this.options[1].children=[];
               this.selectVal= [ ["None"],["None"],["None"],["None"],["None"],["None"],["None"]] ;
               this.chooseFlag = false;
           }
           this.skillComputeFlag = !this.skillComputeFlag;
           this.chooseDialogVisible=false;
       },
        //选择cost之后整合计算cost
       handleChange(value){
           this.cost = 10;
           let costSum = 0 ;
           let decoration_lv_temp = 0;
           this.costSkillList=[];
           this.armorDecorationsNow = this.armorDecorationsNow2.concat() ;
           //console.log(this.armorDecorationsNow, this.armorDecorationsNow2);
           this.selectVal.forEach((element, index) => {
               switch (element[0]) {
                    case "None": break;
                    case "+skill": 
                        this.costSkillList.push(  //0: "+skill" 1: -15  2: 1
                            { id: parseInt(element[2]), name: this.skillList[element[2]].name ,level: 1 });
                        costSum = costSum + element[1] ;
                        break;
                    case "-skill": 
                        this.costSkillList.push(  //0: "-skill" 1: 145
                            { id: parseInt(element[1]), name: this.skillList[element[1]].name ,level: -1 });
                        costSum = costSum + 10 ;
                        break;
                    case "+decoration_lv": 
                        costSum = costSum + element[1] ; //0: "+decoration_lv" 1: -18
                        decoration_lv_temp = decoration_lv_temp - element[1]/6;
                        break;
                    default:
                        break;
               }
           });
           this.cost = this.cost + costSum;
           this.costDecoration_lv = decoration_lv_temp; ////计算cost添加了几个孔
           console.log(this.costDecoration_lv);
           let temp=0,temp4=0;//计算装备多少个 0 孔和4孔
           if (this.costDecoration_lv>0) {
               this.armorDecorationsNow.forEach(elementA => { 
                    if (elementA == 0) {
                        temp++;
                    }else if (elementA == 4) {
                        temp4++;
                    }
                });
               while (temp>0) {  //填充0孔
                        this.armorDecorationsNow[3-temp] = 1; 
                        temp-- ;
                        this.costDecoration_lv = this.costDecoration_lv - 1 ;
                }
                if (temp4<3) { //填充非4孔
                    for (let index = 0; index < 3; index++) {
                            if ( (this.armorDecorationsNow[index]+this.costDecoration_lv)>4 ) {
                                this.costDecoration_lv = this.costDecoration_lv-(4-this.armorDecorationsNow[index]) ;
                                this.armorDecorationsNow[index] = 4 ;
                            }else{
                                this.armorDecorationsNow[index] = this.costDecoration_lv + this.armorDecorationsNow[index] ;
                                break;
                            }
                        }
                }
           }
           this.skillComputeFlag = !this.skillComputeFlag; //触发技能计算
       },
       handleClose(){
           this.chooseDialogVisible=false;
       },
       handleDecorationClose(){
           this.decorationDialogVisible=false;
       },
       showDecorations(index,sLv){
           //console.log(this.armorDecorationsNow[index]);
           /* if ( parseInt(this.armorDecorationsNow[index]) !=0 ) {  */ //非0孔打开展示
                this.decorationDialogVisible=true;
                this.slotLv = sLv;
                this.decoFlag = parseInt(index);//目前点击打开的孔位index
                this.decoFlagChange();
                console.log("孔位等级："+this.slotLv, "孔位位置："+this.decoFlag)
            /*}else{
                this.slotLv = sLv;
                this.decoFlag = parseInt(index);
                this.decoAllSkill[this.decoFlag] = null;//0孔点击清空选择，因为cost选择加孔后取消，会出现0孔不可点击但是珠子技能还在
           } */
       },
       /* divDecoraton(lv, item ){
           switch (lv) {
               case 0: this.lv0DecoList.push(item);  break;
               case 1: this.lv1DecoList.push(item);  break;
               case 2: this.lv2DecoList.push(item);  break;
               case 3: this.lv3DecoList.push(item);  break;
               case 4: this.lv4DecoList.push(item);  break;
               default: console.log("Error custom!!!!!!");
                   break;
           }
       }, */
       chooseDecoration(index){
           if ( index == 0 ) {  // 清除选择
               this.decoAllSkill[this.decoFlag] = null;
               this.deco[this.decoFlag] = { decoId:0 , decoName: "" };
           }else{
                //showDecoList和allDecoList格式
                //temp = { id: item.id.MrDeco+200, lv: item.decoration_lv, name: this.mrDecoNameList[item.id.Deco].content[13],
                //skillId: this.skillList[item.skill_id_list[0].Skill]+1, skillLv: this.skillList[item.skill_lv_list[0]] };
                //填充选择的饰品
                this.deco[this.decoFlag].decoId = this.showDecoList[index].id;
                this.deco[this.decoFlag].decoName = this.showDecoList[index].name;
                //console.log("deco",this.deco);
                //珠子显示  填充 
                // armorSkill  格式{id: parseInt(element1.MrSkill)+112, name: this.skillList[element1.MrSkill+112].name ,level: element.skill_lv_list[index]});
                this.allDecoList.forEach(element => {
                    if ( this.showDecoList[index].id == element.id ) {
                        this.decoAllSkill[this.decoFlag] = { id: parseInt(element.skillId), name: this.skillList[element.skillId].name,level: parseInt(element.skillLv) } ;
                    }
                });    
           }
           this.decorationDialogVisible=false;
           this.skillComputeFlag = !this.skillComputeFlag; //触发计算总技能
       },

       filterArmor(entries){
           let time = entries.length;
           for (let index = 0; index < time; index++) {
               let element = entries[index];
               if( element.content[13]=="" || element.content[13].startsWith("<") )
               {
                   entries.splice(index,1);
                   --index,--time;
               }
           }
            let array1 = new Array(33);
            array1[13]="不选择";
            let ob = {name:"",guid:"",hash:"",attributes:"",content: array1 };
            entries.push(ob);
            this.filterArmorNameEntries = entries.reverse();
            //补满最后一行
            let remainder = parseInt(this.filterArmorNameEntries.length%5);
            if ( remainder>0 ) {
                while ( (5-remainder)>0 ) {
                    this.filterArmorNameEntries.push(this.filterArmorNameEntries[this.filterArmorNameEntries.length-1]);
                    ++remainder;
                }
            }
       },
       decoFlagChange(){
            console.log("触发孔位选择");
            this.showDecoList = [];//先清空
            switch (parseInt(this.slotLv)) {
                case 4: this.showDecoList = this.showDecoList.concat(this.lv4DecoList,this.lv3DecoList,this.lv2DecoList,this.lv1DecoList)  ;break;
                case 3: this.showDecoList = this.showDecoList.concat(this.lv3DecoList,this.lv2DecoList,this.lv1DecoList)  ;break;
                case 2: this.showDecoList = this.showDecoList.concat(this.lv2DecoList,this.lv1DecoList)  ;break;
                case 1: this.showDecoList = this.showDecoList.concat(this.lv1DecoList)  ; break;
                case 0: this.showDecoList = this.showDecoList.concat(this.lv0DecoList)  ; break;
                default: console.log("slot level < 0 !");
                    break;
            }
            //补满最后一行,一行5个 ,第一个补位 None
            ////////////////////////////////////
            let remainder2 = this.showDecoList.length%5;
            if (remainder2>0) {
                while ((5-remainder2)>0) {
                    this.showDecoList.push(this.showDecoList[this.showDecoList.length-1]);
                    ++remainder2;
                }
            }
       },
   },

   //计算属性  ,数据被改变后，会触发此进行计算
   computed:{
       searchSum(){
           return Math.ceil(this.filterArmorNameEntries.length/5);
       },
       decoSum(){ //计算装饰品
           return Math.ceil(this.showDecoList.length/5);
       }
   },
   //监控data中的数据变化
   watch:{
        //以属性名作为此种方法名对此进行监听
        /* decoFlag(newValue ,oldValue){ //选择孔位时展示不同等级装饰品
            console.log("触发孔位选择");
            this.showDecoList = [];//先清空
            switch (parseInt(this.slotLv)) {
                case 4: this.showDecoList = this.showDecoList.concat(this.lv4DecoList,this.lv3DecoList,this.lv2DecoList,this.lv1DecoList)  ;break;
                case 3: this.showDecoList = this.showDecoList.concat(this.lv3DecoList,this.lv2DecoList,this.lv1DecoList)  ;break;
                case 2: this.showDecoList = this.showDecoList.concat(this.lv2DecoList,this.lv1DecoList)  ;break;
                case 1: this.showDecoList = this.showDecoList.concat(this.lv1DecoList)  ;console.log("1kong"); break;
                case 0: this.showDecoList = this.showDecoList.concat(this.lv0DecoList)  ;console.log("0kong"); break;
                default: console.log("slot level < 0 !");
                    break;
            }
            //补满最后一行,一行5个 ,第一个补位 None
            ////////////////////////////////////
            let remainder2 = this.showDecoList.length%5;
            if (remainder2>0) {
                while ((5-remainder2)>0) {
                    this.showDecoList.push(this.showDecoList[this.showDecoList.length-1]);
                    ++remainder2;
                }
            }
        }, */
        skillComputeFlag(newValue ,oldValue ){  //触发计算
            this.skillComputeList=[];
            let tempListDeco= [];
           // showDecoList和allDecoList格式
        //    temp = { id: item.id.MrDeco+200, lv: item.decoration_lv, name: this.mrDecoNameList[item.id.Deco].content[13],
        //     skillId: this.skillList[item.skill_id_list[0].Skill]+1, skillLv: this.skillList[item.skill_lv_list[0]] };
            this.decoAllSkill.forEach( (element,index) => {
                if (element != "None" && element != undefined && element != null ) {
                    console.log(element);
                    tempListDeco.push({ id: element.id ,name: this.skillList[element.id].name ,level: element.level });
                }
            });
            // armorSkill  格式{id: parseInt(element1.MrSkill)+112, name: this.skillList[element1.MrSkill+112].name ,level: element.skill_lv_list[index]});
            this.skillComputeList = this.armorSkill.concat(tempListDeco, this.customAllSkill, this.costSkillList);

            if (this.skillComputeList.length>=1) { //数量大于等于1个，技能整合 有可能+1  -1
                let tempList= new Array();
                this.skillComputeList.forEach(t => { //避免修改同一个array
                    tempList.push({ id: parseInt(t.id), level: parseInt(t.level) });
                });
                let tempList2 = new Array();
                tempList2.push( { id: parseInt(tempList[0].id), name: this.skillList[parseInt(tempList[0].id)].name , level: parseInt(tempList[0].level) });
                tempList.splice(0,1);//删除，取一个先放到tempList2，然后计算合并
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
                this.skillComputeList = tempList2;
            }else{  //0个或一个无须合并

            }
            this.$emit( 'legSkill' ,this.skillComputeList) ;
            // this.notifyFather = !this.notifyFather;
        },
   },
   


}
</script>

<style scoped>
/* 装备选择框下拉框 */
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
/* 装备技能卡片 */
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 2px;
}

.box-card {
  width: 100%;
}
</style>
