/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import type {Node} from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { theme } from './color';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const STORAGE_KEY = "@toDos"

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';



  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    loadToDos();
    setCheck();
    
  }, []);


  useEffect(() => {
    checkWorking();
  });

  const [isDone, setIsDone] = useState(false);
  const [loadWork, setLoadWork] = useState({});
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => {
    setWorking(true);
    
  };
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave) );
  }

  const loadToDos = async() => {
    const s= await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
    
  };  

  const checkWorking = () => {
   AsyncStorage.setItem('@Working', JSON.stringify(working));
  }
  
  const setCheck = async() => {
    const s =  await AsyncStorage.getItem('@Working');
    console.log(s);
    if (s === "true") {
      work();
    } else {
      travel();
    }
  }

  const deleteToDo = (key) => {
    console.log(key);
    Alert.alert("Delete", "Sure?", [
    {text:"No"},
    { 
      text:"Yes",
      onPress: () => {
        const newToDos = {...toDos}
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);

      }, 
    },
    ]);
    return;
  
  }

  const addToDo = async() => {
    if(text === "") {
      return;
    } 
    const newToDos = {...toDos, [Date.now()]: {text, working, isDone}};
    setToDos(newToDos); 
    await saveToDos(newToDos);
    setText("");
  };

  const changeIsDone = () => {
    if(isDone === false) {
      setIsDone(true);
    } else {
      setIsDone(false);
    }
  }

  return (
  
   <View style={styles.container}>
     <View style={styles.header}>
       <TouchableOpacity onPress={work}>
       <Text  style={{...styles.btnText, color: working? "white" : theme.grey}}>Work</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={travel}>
       <Text style={{...styles.btnText, color: !working? "white" : theme.grey}}>Travel</Text>
       </TouchableOpacity>
       
        
     </View>
     <View>
       <TextInput
       value={text}
       onSubmitEditing={addToDo}
       onChangeText={onChangeText}
        placeholder={working? "Add a To Do" : "Where Do You Want To Go?"} 
        style={styles.input}
        ></TextInput>
        <ScrollView>{
          Object.keys(toDos).map((key) => 
          toDos[key].working === working ? (<View style={styles.toDo} key={key}>
            <BouncyCheckbox size={20} fillColor="#339933" iconStyle={{borderColor : "#339933"}} unfillColor="#FFF" ></BouncyCheckbox>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteToDo(key)}>
              <Text>❌</Text>
            </TouchableOpacity>
          </View>
          )  : null
          )}</ScrollView>
     </View>
   </View>
  );
};

const styles = StyleSheet.create({
container: {
  flex:1,
  backgroundColor: theme.bg,
  paddingHorizontal: 20,
},
header: {
  flexDirection: "row",
  marginTop: 100,
  justifyContent: "space-between"

},
btnText: {
  fontSize:38,
  fontWeight:"600",
  
},
input: {
  backgroundColor:"white",
  paddingVertical:10,
  paddingHorizontal: 20,
  borderRadius: 30,
  marginVertical: 20,
  fontSize: 20,
},
toDo: {
  backgroundColor:theme.toDoBg,
  marginBottom:10,
  paddingVertical:15,
  paddingHorizontal: 20,
  borderRadius:15,
  flexDirection: "row",
  alignItems:"center",
  justifyContent:"space-between",
},
toDo2: {
  backgroundColor:"#222222",
  marginBottom:10,
  paddingVertical:15,
  paddingHorizontal: 20,
  borderRadius:15,
  flexDirection: "row",
  alignItems:"center",
  justifyContent:"space-between",
},
toDoText: {
  color:"white",
  fontSize: 16,
  fontWeight: "500",
  marginRight:130
}
});

export default App;
