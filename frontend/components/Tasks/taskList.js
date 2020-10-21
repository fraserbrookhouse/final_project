import React, { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native'
import axios from 'axios'
import { railsServer } from '../../serverAddress'
import { TasksContext } from '../../context'
import { SwipeListView } from 'react-native-swipe-list-view'
import CompletedButton from './completeTaskButton'
import DeleteButton from './deleteTaskButton'
import { calculateExpTime, completeTask } from './taskHelpers'
import CountDown from 'react-native-countdown-component'

function TaskList({ navigation }) {
  let { taskList, setTaskList, user } = useContext(TasksContext)
  let [taskListView, setTaskListView] = useState([])

  //add time param in the db
  useEffect(() => {
    setTaskListView(
      taskList.map((task) => ({
        key: task.title,
        id: task._id.$oid,
        title: task.title,
        description: task.description,
        completed: task.completed,
        expiryTime: calculateExpTime(task.expiryTime),
      })),
    )
  }, [taskList])
  return (
    <View style={styles.container}>
      <View>
        <SwipeListView
          data={taskListView.filter((task) => task.completed == false)}
          renderItem={(data, rowMap) =>
            data.item.expiryTime == 0 ? (
              <View style={styles.rowFront}>
                <Text>{data.item.title}</Text>
              </View>
            ) : (
              <View style={styles.rowFront}>
                <Text>
                  {data.item.title}
                  <CountDown
                    //duration of countdown in seconds
                    until={data.item.expiryTime}
                    //format to show
                    timetoShow={('H', 'M', 'S')}
                    onFinish={() =>
                      completeTask(user, data.item.id, setTaskList, true, -1)
                    }
                    size={12}
                  />
                </Text>
              </View>
            )
          }
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowBack}>
              <View style={[styles.backRightBtn, styles.backLeftBtn]}>
                <CompletedButton
                  user={user}
                  taskId={data.item.id}
                  setTaskList={setTaskList}
                />
              </View>
            </View>
          )}
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowBack}>
              <View style={[styles.backRightBtn, styles.backLeftBtn]}>
                <CompletedButton
                  user={user}
                  taskId={data.item.id}
                  setTaskList={setTaskList}
                />
              </View>
              <View
                style={[
                  styles.backTextWhite,
                  styles.backRightBtn,
                  styles.backRightBtnLeft,
                ]}
              >
                <Button
                  style={
                    (styles.backTextWhite,
                    styles.backRightBtn,
                    styles.backRightBtnLeft)
                  }
                  onPress={() =>
                    navigation.navigate('Edit Task', {
                      taskTitle: data.item.title,
                      taskDescription: data.item.description,
                      taskId: data.item.id,
                    })
                  }
                  title="Edit"
                />
              </View>
              <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <DeleteButton
                  user={user}
                  taskId={data.item.id}
                  setTaskList={setTaskList}
                />
              </View>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-150}
        />
        <View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('Add Task')}
          >
            <Image source={require('../../assets/plus.png')} />
            {/* <Text style={styles.inputText}>Add a new task</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.navigate('Completed Task List')}
          >
            <Image source={require('../../assets/done.png')} />
            {/* <Text style={styles.inputText}>Completed Tasks</Text> */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#003f5c',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#465881',
    borderBottomColor: '#003f5c',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 75,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backLeftBtn: {
    width: 250,
    backgroundColor: 'green',
    left: 0,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  inputText: {
    height: 50,
    color: 'white',
    padding: 17,
  },

  addBtn: {
    alignSelf: 'center',
    left: 50,
    bottom: -390,
  },

  doneBtn: {
    alignSelf: 'center',
    right: 50,
    flexDirection: 'row',
    bottom: -330,
  },
})

export default TaskList
