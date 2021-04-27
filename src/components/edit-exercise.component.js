import React, {Component} from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import axios from 'axios';

export class EditExercise extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this
            .onChangeUsername
            .bind(this);
        this.onChangeDescription = this
            .onChangeDescription
            .bind(this);
        this.onChangeDuration = this
            .onChangeDuration
            .bind(this);
        this.onChangeDate = this
            .onChangeDate
            .bind(this);
        this.onSubmit = this
            .onSubmit
            .bind(this);
        this.state = {
            username: '',
            description: '',
            duration: 0,
            date: new Date(),
            users: []
        }

    }
    componentDidMount() {
        axios
            .get('http://localhost:5000/users/')
            .then(res => {
                if (res.data.length > 0) { //적어도 1명 이상 유저있는경우
                    this.setState({
                        users: res
                            .data
                            .map(user => user.username), //user의 username을 배열로 만든것을 return 해주는게 map
                        username: res
                            .data[0]
                            .username
                    })
                }
            })
        axios
            .get('http://localhost:5000/exercises/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    username: res.data.username,
                    description: res.data.description,
                    duration: res.data.duration,
                    date: new Date(res.data.date)

                })

            })
            .catch(err => console.error(err))

        }

    onChangeUsername(e) {
        this.setState({username: e.target.value})

    }
    onChangeDescription(e) {
        this.setState({description: e.target.value})

    }
    onChangeDuration(e) {
        this.setState({duration: e.target.value})

    }
    onChangeDate(date) {
        this.setState({date: date});

    }
    onSubmit(e) {
        e.preventDefault();
        const exercise = {
            username: this.state.username,
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date
        }
        console.log(exercise);
        axios
            .post(
                'http://localhost:5000/exercises/update/' + this.props.match.params.id,
                exercise
            )
            .then(res => console.log(res.data()))
            .catch(err => console.error(err));
        window.location = '/'; // list hp로 되돌리기.
    }
    render() {
        return (
            <div>
                <h3>Edit Exercise Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username:
                        </label>
                        <select
                            required="required"
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}>
                            {
                                this
                                    .state
                                    .users
                                    .map(function (user) {
                                        return <option key={user} value={user}>{user}
                                        </option>;
                                    })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description:
                        </label>
                        <input
                            type="text"
                            required="required"
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChangeDescription}/>
                    </div>
                    <div className="form-group">
                        <label>Duration (in minutes):
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.duration}
                            onChange={this.onChangeDuration}/>
                    </div>
                    <div className="form-group">
                        <label>Date:
                        </label>
                        <div>
                            <DatePicker selected={this.state.date} onChange={this.onChangeDate}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Edit Exercise Log" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default EditExercise
