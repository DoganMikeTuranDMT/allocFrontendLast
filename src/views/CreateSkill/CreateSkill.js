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
import { TextField, IconButton } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import axios from "axios";
import Panelheader from "../../components/PanelHeader/PanelHeader";
import apiFacade from "../../auth/apiFacade";
import MyTable from "./CreateSkillTable/MyTable";

const createOption = label => ({
  label,
  value: ""
});

const getAllUserSubSkill = async subskillid => {
  let data = await apiFacadeGetDataUserSubSkill(subskillid);
  return data;
};
const getAllUserSubSkillMapped = async subskillid => {
  let a = await apiFacadeGetDataUserSubSkill(subskillid);

  const selectOptionsUserSubSkill = a.map(item => ({
    name: item.firstname + " " + item.lastname,
    proficiency:
      item.userSubSkill &&
      item.userSubSkill.length > 0 &&
      item.userSubSkill[0].proficiency
        ? item.userSubSkill[0].proficiency
        : "",
    subscription:
      item.userSubSkill &&
      item.userSubSkill.length > 0 &&
      item.userSubSkill[0].userId
        ? "Yes"
        : "No",
    id: item.id
  }));
  return selectOptionsUserSubSkill;
};

const apiFacadeGetDataSkill = async () => {
  try {
    const data = await apiFacade.getData(
      `skill/${localStorage.getItem("decoded")}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const apiFacadeGetDataUserSubSkill = async subskillid => {
  try {
    const data = await apiFacade.getData(
      `empusers/${subskillid}/${localStorage.getItem("decoded")}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const createUpdate = async (newOption, config) => {
  try {
    await axios.post(
      "https://remnzallocation.azurewebsites.net/api/skill",
      {
        name: newOption.label,
        clientid: parseInt(localStorage.getItem("decoded"))
      },
      config
    );
    let data = await apiFacadeGetDataSkill();
    return data;
  } catch (e) {
    console.log(e);
  }
};

const apiFacadeGetDataSubSkill = async newSkillid => {
  try {
    const data = await apiFacade.getData(
      `subskill/${localStorage.getItem("decoded")}/${newSkillid}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const createUpdateSubSkill = async (newOption, config, newSkillid) => {
  try {
    await axios.post(
      "https://remnzallocation.azurewebsites.net/api/subskill",
      {
        name: newOption.label,
        clientid: parseInt(localStorage.getItem("decoded")),
        skillid: newSkillid
      },
      config
    );

    let data = await apiFacadeGetDataSubSkill(newSkillid);
    return data;
  } catch (e) {
    console.log(e);
  }
};

class CreateSkill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOptions: [],
      selectOptionsSubSkill: [],
      name: "",
      id: "",
      input: "",
      isLoadingSkill: false,
      isLoadingSubSkill: false,
      value: undefined,
      value2: "",
      data: [],
      props: "",
      teststate: "0",
      subskillid: 0,
      index: undefined
    };
  }
  HandleClickVariant = userId => () => {
    const item = this.state.data.find(i => i.id === userId);
    axios
      .put(
        `https://remnzallocation.azurewebsites.net/api/usersubskill/${userId}/${
          this.state.subskillid
        }/${localStorage.getItem("decoded")}/${Number(item.proficiency)}`
      )
      .then(response => {
        this.props.enqueueSnackbar("Success", { variant: "success" });
        this.setState({ index: undefined });
      })
      .catch(error => {
        this.props.enqueueSnackbar(error.message, { variant: "error" });
        this.setState({ index: undefined });
      });
  };

  handleChangeInput = myindex => event => {
    let id = myindex;
    let data = [...this.state.data];
    data[id].proficiency = event.target.value;
    if (data[id].proficiency.length < 1) {
      data[id].proficiency = "";
    }
    if (data[id].proficiency.length > 2) {
      data[id].proficiency = "100";
    }
    this.setState({ data: data, index: myindex });
  };
  consoleFunction = userid => event => {
    if (event.key === "Enter") {
      this.HandleClickVariant(userid)();
      event.target.blur();
      this.setState({ index: undefined });
    }
  };
  // focus = index => event => {
  //   this.setState({ index: index });
  // };

  Unsubscribe = userid => {
    apiFacade
      .DeleteData(
        `usersubskill/${userid}/${localStorage.getItem("decoded")}/${
          this.state.subskillid
        }`
      )
      .then(response => {
        getAllUserSubSkillMapped(this.state.subskillid).then(data => {
          this.setState({ data: data, index: undefined });
        });
      });

    //e.preventDefault();
  };
  Subscribe = userid => {
    axios
      .post("https://remnzallocation.azurewebsites.net/api/usersubskill", {
        clientid: parseInt(localStorage.getItem("decoded")),
        userid: userid,
        subskillid: this.state.subskillid
      })
      .then(response => {
        getAllUserSubSkillMapped(this.state.subskillid).then(data => {
          this.setState({ data: data, index: undefined });
        });
      });
  };

  componentDidMount() {
    apiFacade
      .getData(`skill/${localStorage.getItem("decoded")}`)
      .then(response => {
        console.log(response);
        const selectOptions = response.map(item => ({
          value: item.id,
          label: item.name
        }));
        this.setState({ selectOptions });
      });
  }

  handleChange = newValue => {
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
      apiFacade
        .getData(
          `subskill/${localStorage.getItem("decoded")}/${newValue.value}`
        )

        .then(response => {
          const selectOptionsSubSkill = response.map(item => ({
            value: item.id,
            label: item.name
          }));
          this.setState({
            selectOptionsSubSkill: selectOptionsSubSkill,
            value: newValue
          });
        });
    }
  };

  handleChange2 = async newValue => {
    let items = await getAllUserSubSkill(newValue.value);
    const selectOptionsUserSubSkill = items.map(item => ({
      name: item.firstname + " " + item.lastname,
      proficiency:
        item.userSubSkill &&
        item.userSubSkill.length > 0 &&
        item.userSubSkill[0].proficiency
          ? item.userSubSkill[0].proficiency
          : "",
      subscription:
        item.userSubSkill &&
        item.userSubSkill.length > 0 &&
        item.userSubSkill[0].userId
          ? "Yes"
          : "No",
      id: item.id
    }));
    this.setState({
      data: selectOptionsUserSubSkill,
      value2: newValue,
      subskillid: newValue.value,
      index: undefined
    });
  };

  // ------------------------------- SKILL CREATING ------------------------------------->
  handleCreate = inputValue => {

    this.setState({ isLoadingSkill: true });
    const newOption = createOption(inputValue);

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
    createUpdate(newOption, config).then(response => {
      const newselectOptions = response.map(item => ({
        value: item.id,
        label: item.name
      }));
      console.log("Inden loop");
      for (let index = 0; index < newselectOptions.length; index++) {
        console.log("Inden i loop");
        if (newselectOptions[index].label === newOption.label) {
          console.log("Inden i IF");
          newOption.value = newselectOptions[index].value;

          this.state.selectOptionsSubSkill = [];
          this.setState({
            isLoadingSkill: false,
            selectOptions: [...newselectOptions],
            value: newOption
          });
        }
      }
    });
  };
  // ------------------------------------------------------------------------------------------------>
  handleCreate2 = inputValue => {
 
    this.setState({ isLoadingSubSkill: true });
    const newOption = createOption(inputValue);
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    createUpdateSubSkill(newOption, config, this.state.value.value).then(
      response => {
        const selectOptionsSubSkill = response.map(item => ({
          value: item.id,
          label: item.name
        }));
        console.log("før loop");
        for (let index = 0; index < selectOptionsSubSkill.length; index++) {
          console.log("inde i loop");
          if (selectOptionsSubSkill[index].label === newOption.label) {
            console.log("inde i if");
            newOption.value = selectOptionsSubSkill[index].value;

            this.setState({
              isLoadingSubSkill: false,
              selectOptionsSubSkill: [...selectOptionsSubSkill],
              value2: newOption,
              selectOptionsSubSkill: selectOptionsSubSkill
            });
            this.handleChange2(newOption);
          }
        }
      }
    );
  };
  runTable = () => {
    if (this.state.data.length > 0) {
      const fields = [
        { name: "name", title: "Name" },
        {
          name: "proficiency",
          title: "Proficiency",
          getCellValue: row =>
            row.proficiency == "" && row.subscription == "No"
              ? ""
              : this.state.data.map((item, index) => {
                  return item.id == row.id ? (
                    <div>
                      <TextField
                        id="standard-basic"
                        margin="normal"
                        style={{ width: "35%" }}
                        checked
                        id={index.toString()}
                        type="number"
                        value={item.proficiency}
                        onChange={this.handleChangeInput(index)}
                        onKeyPress={this.consoleFunction(row.id)}
                      />

                      {/* <this.proficiencySubmitHandler
                        userid={row.id}
                        myindex={index}
                      /> */}
                      {this.state.index == index ? (
                        <IconButton>
                          <CheckIcon
                            type="submit"
                            color="primary"
                            onClick={this.HandleClickVariant(row.id)}
                          />
                        </IconButton>
                      ) : null}
                    </div>
                  ) : (
                    ""
                  );
                })
        },
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
      return <MyTable columns={fields} data={this.state.data} />;
    } else {
      return <div>No Skills chosen or created...</div>;
    }
  };
  render() {
    const { isLoadingSkill, isLoadingSubSkill, value, value2 } = this.state;
    return (
      <div>
        <Panelheader size="sm" />
        <div className="content">
          <Row>
            <Col xs="6">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle>Search or create Skill</CardTitle>
                </CardHeader>
                <CardBody>
                 
                  <CreatableSelect
                    isClearable
                    isLoading={isLoadingSkill}
                    onChange={this.handleChange}
                    onCreateOption={this.handleCreate}
                    options={this.state.selectOptions}
                    value={value}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col xs="6">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle>Search or create Subskill</CardTitle>
                </CardHeader>
                <CardBody>
                  <CreatableSelect
                    isClearable
                    isLoading={isLoadingSubSkill}
                    onChange={this.handleChange2}
                    onCreateOption={this.handleCreate2}
                    options={this.state.selectOptionsSubSkill}
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
                <CardBody>{this.runTable()}</CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withSnackbar(CreateSkill);
