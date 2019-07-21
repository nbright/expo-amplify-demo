import React from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, 
	StatusBar, Dimensions, Platform } from "react-native"

import Amplify, { API, graphqlOperation } from "aws-amplify"
import config from "./aws-exports"
import { createTodo } from "./src/graphql/mutations"
import { listTodos } from "./src/graphql/queries"

const { height, width } = Dimensions.get("window");

Amplify.configure(config)

export default class App extends React.Component {
	state = {
		toDay: new Date().toLocaleDateString(),
		name: "",
		todos: []
	}

	async componentDidMount() {
		try {
			const todos = await API.graphql(graphqlOperation(listTodos))
			console.log("todos: ", todos)
			this.setState({ todos: todos.data.listTodos.items })
		} catch (err) {
			console.log("error: ", err)
		}
	}

	onChangeText = (key, val) => {
		this.setState({ [key]: val })
	}

	addTodo = async event => {
		const { name, todos } = this.state

		event.preventDefault()

		const input = {
			name
		}

		const result = await API.graphql(graphqlOperation(createTodo, { input }))

		const newTodo = result.data.createTodo
		const updatedTodo = [newTodo, ...todos]
		this.setState({ todos: updatedTodo, name: "" })
	}

	render() {
		const { 
			toDay
		} = this.state;
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" />
				<Text style={styles.title}>{toDay}오늘 하루중</Text>
				<Text style={styles.subTitle}>가장 안 좋았던 일</Text>
				<View style={styles.card}>
					<TextInput
						style={styles.input}
						placeholder='ㅠ.ㅠ 기분 나빠...'
						value={this.state.name}
						onChangeText={val => this.onChangeText("name", val)}
						returnKeyType={"done"}
						autoCorrect={false}
					/>
				</View>
				<TouchableOpacity onPress={this.addTodo} style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Add +</Text>
				</TouchableOpacity>
				{this.state.todos.map((todo, index) => (
					<View key={index} style={styles.todo}>
						<Text style={styles.name}>{todo.name}</Text>
					</View>
				))}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#009688",
		alignItems: "center"
	},
	title: {
		color: "white",
		fontSize: 30,
		marginTop: 50,
		fontWeight: "200",
		marginBottom: 30
	},
	card: {
		backgroundColor: "white",
		flex: 1,
		width: width - 25,
		// borderTopLeftRadius: 10,
		// borderTopRightRadius: 10,
		borderRadius:10,
		
		marginBottom: 40,
		...Platform.select({
		  ios: {
			shadowColor: "rgb(50, 50, 50)",
			shadowOpacity: 0.4,
			shadowRadius: 5,
			shadowOffset: {
			  height: -1,
			  width: 0
			}
		  },
		  android: {
			elevation: 3
		  }
		})
	  },
	subTitle: {
		color: "white",
		fontSize: 18,
		marginTop: 10,
		fontWeight: "200",
		marginBottom: 10
	},
	input: {
		padding: 20,
		borderBottomColor: "#bbb",
		borderBottomWidth: 1,
		fontSize: 18
	  },
	buttonContainer: {
		backgroundColor: "#34495e",
		marginTop: 10,
		marginBottom: 10,
		padding: 10,
		borderRadius: 5,
		alignItems: "center"
	},
	buttonText: {
		color: "#fff",
		fontSize: 24
	},
	todo: {
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
		paddingVertical: 10
	},
	name: { fontSize: 16 }
})