const API = 'https://api.github.com';
const ENDPOINTS = {
	USERS: `${API}/users`
};

const Title = (props) => {
	const {text} = props;
	
	return (
		<h2 className="title">{text}</h2>
	)
};

const Form = (props) => {
	const {
		onTextChange, 
		onSubmitClick
	} = props;
	
	return(
		<form className="search">
			<input type="text" placeholder="Github Username" onChange={onTextChange} />
			<button onClick={onSubmitClick}>Search</button>
		</form>
	)
};

const Loading = (props) => {
	const {
		isLoading, 
		message
	} = props;
	
	if(!isLoading) {
		return false;
	}
	
	return(
		<p className="loading">{message}</p>
	)
};

const User = (props) => {
	const {
		name,
		id,
		avatar,
		bio
	} = props;
		
	return(
		<div className="card card-user">
			<div className="card-user__avatar">
				<img src={avatar} alt={name} />
			</div>
			<div className="card-user__info">
				<p>Name: {name}</p>
				<p>ID: {id}</p>
				<p>Bio: {bio}</p>
			</div>
		</div>
	)
};

const NotFound = (props) => {
	const {
		error, 
		message
	} = props;
	
	if(!error) {
		return false; 
	}
	
	return(
		<div className="not-found">{message}</div>
	)
};

const Repositories = (props) => {
	const { repos } = props;
	
	return (
		<div className="card-repositories">
			<h2>Repositories</h2>
			<ul className="card-repositories__list">
				{
					!(repos.length) ?

					<h3>There are no repositories</h3> :

					repos.map((repo) => {
						return <li key={repo.id}>
							<a href={repo.html_url} target="_blank">{repo.name}</a>
						</li>
					})
				}
			</ul>
		</div>
	)
};

const initialState = {
	userData: {},
	userRepos: [],
	inputValue: '',
	loading: false,
	notFound: false,
	fetched: false
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;
		this.handleChange = this.handleChange.bind(this);
		this.fetchUser = this.fetchUser.bind(this);
		this.fetchUserRepos = this.fetchUserRepos.bind(this);
		this.searchUser = this.searchUser.bind(this);
	}

	fetchUser(user) {
		this.setState({loading: true});
		fetch(`${ENDPOINTS.USERS}/${user}`)
			.then((response) => response.ok ? response.json() : this.setState({
				userData: {},
				loading: false,
				notFound: true,
				fetched: true
			}))
			.then((data) => {
				this.setState({
					userData: data,
					loading: false,
					notFound: false,
					fetched: true
				});
		})
		.catch((err) => {
			this.setState({
				userData: {},
				loading: false,
				notFound: true,
				fetched: false
			});
			throw new Error('It was impossible to fetch data');
		})
	}
		
	fetchUserRepos(user) {
		this.setState({
			userRepos: []
		});
		
		fetch(`${ENDPOINTS.USERS}/${user}/repos`)
			.then((response) => response.json())
			.then((data) => 
				this.setState(() => {
					console.log(data.length);
					return {userRepos: this.state.userRepos.concat(data)};
				}))
			.catch((err) => { 
				this.setState({
					userRepos: []
				});
				throw new Error(err) 
			});
	}
	
	handleChange(e) {
		this.setState({
			inputValue: e.target.value
		})
	}
	
	searchUser(e) {
    e.preventDefault();
		this.fetchUser(this.state.inputValue);
		this.fetchUserRepos(this.state.inputValue);
	}
		
	componentDidMount() {
		this.searchUser();
		this.fetchUserRepos();
	}
	
	render() {
		const repositories = this.state.userRepos;
		
		return(
			<div className="app-wrapper">							
				<Title 
					text="Search Github Profile by Username">
				</Title>
				
				<Form 
					onTextChange={this.handleChange} 
					onSubmitClick={this.searchUser}>
				</Form>
								
				<Loading 
					isLoading={this.state.loading}
					message="Loading...">
				</Loading>
				
				<NotFound 
					error={this.state.notFound} 
					message="User was not found! :(">
				</NotFound>
				
				<div className="card-wrapper">
					{ 
						(!this.state.fetched) ? null :
						<User
							name={this.state.userData.name}
							id={this.state.userData.id}
							bio={this.state.userData.bio}
							avatar={this.state.userData.avatar_url}>
						</User>
					}
				</div>	
			</div>
		)
	}
};

const render = () => {
	const root = document.querySelector('[data-react-app="root"]');
	
	return (
		ReactDOM.render(
			<App />,
			root
		)
	)
};

const app = {
	render
}

app.render();

