import React from "react";
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from "reactstrap";
import { CreatableSelect } from "@atlaskit/select";
import { withSnackbar } from "notistack";
import axios from "axios";
import Panelheader from "../../components/PanelHeader/PanelHeader";
import apiFacade from "../../auth/apiFacade";
import MyTableRoles from "./CreateProjectTable/MyTable";
import MyTableTracks from "./CreateProjectTable/MyTableTracks";

const createOption = label => ({
  label,
  value: ""
});

const getAllTrackRole = async trackid => {
  let data = await apiFacadeGetDataAllRoleByTrack(trackid);
  return data;
};
const getAllTracksByProject = async projectid => {
  let data = await apiFacadeGetDataTracksByProject(projectid);
  return data;
};
const getAllTrackRoleMapped = async trackid => {
  let a = await apiFacadeGetDataAllRoleByTrack(trackid);

  const selectOptionsTrackRoles = a.map(item => ({
    name: item.name,
    trackname: item.name,
    subscription:
      item.trackRole && item.trackRole.length > 0 && item.trackRole[0].trackId
        ? "Yes"
        : "No",
    id: item.id
  }));
  return selectOptionsTrackRoles;
};

const apiFacadeGetDataProject = async () => {
  try {
    const data = await apiFacade.getData(
      `prproject/${localStorage.getItem("decoded")}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
const apiFacadeGetDataAllRoleByTrack = async trackid => {
  try {
    const data = await apiFacade.getData(
      `role/get/${localStorage.getItem("decoded")}/${trackid}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
const apiFacadeGetDataTracksByProject = async projectid => {
  try {
    const data = await apiFacade.getData(
      `trackrole/${localStorage.getItem("decoded")}/${projectid}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const createUpdateProject = async (newOption, config) => {
  try {
    await axios.post(
      "https://remnzallocation.azurewebsites.net/api/prproject",
      {
        name: newOption.label,
        clientid: parseInt(localStorage.getItem("decoded"))
      },
      config
    );

    let data = await apiFacadeGetDataProject();
    return data;
  } catch (e) {
    console.log(e);
  }
};

const apiFacadeGetDataTrack = async newSkillid => {
  try {
    const data = await apiFacade.getData(
      `track/${localStorage.getItem("decoded")}/${newSkillid}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const createUpdateTrack = async (newOption, config, newSkillid) => {
  try {
    await axios.post(
      "https://remnzallocation.azurewebsites.net/api/track",
      {
        name: newOption.label,
        clientid: parseInt(localStorage.getItem("decoded")),
        projectid: newSkillid
      },
      config
    );
    let data = await apiFacadeGetDataTrack(newSkillid);
    return data;
  } catch (e) {
    console.log(e);
  }
};

class CreateProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOptionsProjects: [],
      selectOptionsTracks: [],
      name: "",
      id: "",
      input: "",
      isLoadingSkill: false,
      isLoadingTrack: false,
      value: undefined,
      value2: "",
      data: [],
      data2: [],
      props: "",
      teststate: "0",
      subskillid: 0,
      index: undefined
    };
  }

  fields = [
    { name: "name", title: "Role Name" },
    {
      name: "subscription",
      title: "Subscribed"
    },
    {
      name: "action",
      title: "Action",

      getCellValue: row =>
        row.subscription == "Yes" ? (
          <Button
            color="danger"
            id={2}
            onClick={() => this.Unsubscribe(row.id)}
          >
            Unsubscribe
          </Button>
        ) : (
          <Button color="success" onClick={() => this.Subscribe(row.id)}>
            Subscribe
          </Button>
        )
    }
  ];
  fieldsTracks = [
    { name: "trackName", title: "Track Name" },
    {
      name: "roleName",
      title: "Role Name"
    }
  ];
  Unsubscribe = async trackid => {
    await apiFacade.DeleteData(
      `trackrole/${this.state.subskillid}/${localStorage.getItem(
        "decoded"
      )}/${trackid}`
    );
    let b = await getAllTracksByProject(this.state.value.value);

    const selectOptionsTrackByProject = b.map(item => ({
      roleName: item.roleName,
      trackName: item.trackName
    }));
    let a = await getAllTrackRoleMapped(this.state.subskillid);
    this.setState({
      data: a,
      index: undefined,
      data2: selectOptionsTrackByProject
    });

    //e.preventDefault();
  };
  Subscribe = async trackid => {
    await axios.post(
      "https://remnzallocation.azurewebsites.net/api/trackrole",
      {
        clientid: parseInt(localStorage.getItem("decoded")),
        trackId: this.state.subskillid,
        roleId: trackid
      }
    );

    let b = await getAllTracksByProject(this.state.value.value);

    const selectOptionsTrackByProject = b.map(item => ({
      roleName: item.roleName,
      trackName: item.trackName
    }));
    let a = await getAllTrackRoleMapped(this.state.subskillid);
    this.setState({
      data: a,
      index: undefined,
      data2: selectOptionsTrackByProject
    });
  };

  componentDidMount() {
    apiFacade
      .getData(`prproject/${localStorage.getItem("decoded")}`)
      .then(response => {
        console.log(response);
        const selectOptionsProjects = response.map(item => ({
          value: item.id,
          label: item.name
        }));
        this.setState({ selectOptionsProjects });
      });
  }

  handleChange = async newValue => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    if (this.state.value2 != "") {
      this.setState({
        value2: ""
      });
    }
    if (newValue != null) {
      let a = await getAllTracksByProject(newValue.value);

      const selectOptionsTrackByProject = a.map(item => ({
        roleName: item.roleName,
        trackName: item.trackName
      }));

      apiFacade
        .getData(`track/${localStorage.getItem("decoded")}/${newValue.value}`)

        .then(response => {
          const selectOptionsTracks = response.map(item => ({
            value: item.id,
            label: item.name
          }));

          this.setState({
            selectOptionsTracks: selectOptionsTracks,
            value: newValue
          });
        });

      this.setState({
        data2: selectOptionsTrackByProject,
        data: ""
      });
      console.log(newValue.value);
    }
  };

  handleChangeTrack = async newValue => {
    let a = await getAllTrackRole(newValue.value);

    const selectOptionsTrackRoles = a.map(item => ({
      name: item.name,
      subscription:
        item.trackRole && item.trackRole.length > 0 && item.trackRole[0].trackId
          ? "Yes"
          : "No",
      id: item.id
    }));

    this.setState({
      index: undefined,
      data: selectOptionsTrackRoles,
      subskillid: newValue.value,
      value2: newValue
    });
  };

  // ------------------------------- SKILL CREATING ------------------------------------->
  handleCreateProject = inputValue => {
    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    this.setState({ isLoadingSkill: true });
    console.group("Option created");
    console.log("Wait a moment...");

    const newOption = createOption(inputValue);
    console.log(newOption.value);
    console.groupEnd();

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    if (this.state.value2 != null) {
      this.setState({
        value2: ""
      });
    }
    createUpdateProject(newOption, config).then(response => {
      console.log(response);
      const newselectOptions = response.map(item => ({
        value: item.id,
        label: item.name
      }));
      console.log(newselectOptions);
      console.log("Inden loop");
      for (let index = 0; index < newselectOptions.length; index++) {
        console.log("Inden i loop");
        if (newselectOptions[index].label === newOption.label) {
          console.log("Inden i IF");
          console.log(newselectOptions[index].value);
          newOption.value = newselectOptions[index].value;
          console.log(newOption);
          console.log(newselectOptions[index].value);

          this.state.selectOptionsTracks = [];
          this.setState({
            isLoadingSkill: false,
            selectOptionsProjects: [...newselectOptions],
            value: newOption
          });
        }
      }
    });
  };
  // ------------------------------------------------------------------------------------------------>
  handleCreateTrack = inputValue => {
    this.setState({ isLoadingTrack: true });
    const newOption = createOption(inputValue);
    console.log(newOption);
    console.groupEnd();

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    createUpdateTrack(newOption, config, this.state.value.value).then(
      response => {
        const selectOptionsTracks = response.map(item => ({
          value: item.id,
          label: item.name
        }));
        console.log(response);
        console.log(newOption);
        console.log(selectOptionsTracks);
        this.setState({ selectOptionsTracks: selectOptionsTracks });
        console.log("før loop");
        for (let index = 0; index < selectOptionsTracks.length; index++) {
          console.log("inde i loop");
          console.log(selectOptionsTracks[index].label);
          if (selectOptionsTracks[index].label === newOption.label) {
            console.log("inde i if");
            console.log(selectOptionsTracks[index].value);
            newOption.value = selectOptionsTracks[index].value;
            console.log(newOption);
            console.log(selectOptionsTracks[index].value);
            this.setState({
              isLoadingTrack: false,
              selectOptionsTracks: [...selectOptionsTracks],
              value2: newOption
            });
            this.handleChangeTrack(newOption);
          }
        }
      }
    );

    console.log(newOption);
  };
  myTestFunction = () => {
    console.log(this.state.teststate);
    this.setState({
      teststate: 1
    });
    console.log(this.state.teststate);
  };
  runTableRoles = () => {
    if (this.state.data.length > 0) {
      return <MyTableRoles columns={this.fields} data={this.state.data} />;
    } else {
      return <div>No Subskill chosen or created...</div>;
    }
  };
  runTableTrack = () => {
    if (this.state.data2.length > 0) {
      console.log(this.state.data2.length);
      return (
        <MyTableTracks columns={this.fieldsTracks} data={this.state.data2} />
      );
    }
  };
  render() {
    const { isLoadingSkill, isLoadingTrack, value, value2 } = this.state;
    return (
      <div>
        <Panelheader size="sm" />
        <div className="content">
          <Row>
            <Col xs="6">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle>Select or create Project</CardTitle>
                </CardHeader>
                <CardBody>
                  <CreatableSelect
                    isClearable
                    isLoading={isLoadingSkill}
                    onChange={this.handleChange}
                    onCreateOption={this.handleCreateProject}
                    options={this.state.selectOptionsProjects}
                    value={value}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col xs="6">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle>Search or create Track</CardTitle>
                </CardHeader>
                <CardBody>
                  <CreatableSelect
                    isClearable
                    isLoading={isLoadingTrack}
                    onChange={this.handleChangeTrack}
                    onCreateOption={this.handleCreateTrack}
                    options={this.state.selectOptionsTracks}
                    value={value2}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader></CardHeader>
                <CardBody>{this.runTableRoles()}</CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader></CardHeader>
                <CardBody>{this.runTableTrack()}</CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withSnackbar(CreateProject);
