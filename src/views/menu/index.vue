<template>
<el-container style="height: 100%; border: 0px solid #eee">
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-tree
      :data="menuData"
      :props="{label:'title', children:'children'}"
      node-key="id"
      :expand-on-click-node="false"
      default-expand-all
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      @node-click="clickMenuNode"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag">
    </el-tree>
  </el-aside>
  
  <el-container>
    <el-form ref="form" :model="menu" label-width="120px">
      <el-form-item label="Title">
        <el-input v-model="menu.title"></el-input>
      </el-form-item>
      <el-form-item label="Path">
        <el-input v-model="menu.path"></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input type="textarea" v-model="menu.Description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">추가</el-button>
        <el-button>취소</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</el-container>
</template>

<style lang="scss" scoped>
</style>

<script>
/* eslint-disable */
import {fetchMenus, saveMenu} from '@/api/menu'
  export default {
    data() {
      return {
        treeItemLabel:'title',
        menuData: [],
        menu: {
          id: 0,
          title: '',
          path: '',
          description: '',
          i18nKey: '',
          icon: ''
        }
      };
    },
    methods: {
      clickMenuNode(node){
        console.log('clickMenuNode', node);
      },
      handleDragStart(node, ev) {
        console.log('drag start', node);
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        console.log('tree drag enter: ', dropNode.label);
      },
      handleDragLeave(draggingNode, dropNode, ev) {
        console.log('tree drag leave: ', dropNode.label);
      },
      handleDragOver(draggingNode, dropNode, ev) {
        console.log('tree drag over: ', dropNode.label);
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', dropNode.label, dropType);
      },
      allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data.label === 'Level two 3-1') {
          return type !== 'inner';
        } else {
          return true;
        }
      },
      allowDrag(draggingNode) {
        return draggingNode.data.label.indexOf('Level three 3-1-1') === -1;
      },
      onSubmit() {
        console.log('submit!', this.menu);
        saveMenu(this.menu);
      }
    },
    created(){
      fetchMenus().then(response => {
          const data = response.data;
          this.menuData = data;
         
        }).catch(error => {
  
        })
    }
  };


</script>
