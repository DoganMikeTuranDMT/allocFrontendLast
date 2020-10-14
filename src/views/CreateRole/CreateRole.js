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
import axios from "axios";
import Panelheader from "../../components/PanelHeader/PanelHeader";
import apiFacade from "../../auth/apiFacade";
import { withSnackbar } from "notistack";
import { TextField, IconButton } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import MyTable from "./CreateRoleTable/MyTable";

const createOption = label => ({
  label,
  value: ""
});
const createUpdateRole = async (newOption, config) => {
  try {
    const resultOfPost = await axios.post(
      "https://remnzallocation.azurewebsites.net/api/role",
      {
        name: newOption.label,
        clientid: parseInt(localStorage.getItem("decoded"))
      },
      config
    );
    console.log("resultOfPost: ", resultOfPost);

    let data = await apiFacadeGetDataRole();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};
const getAllRoleSubskillMapped = async roleid => {
  let a = await apiFacadeGetDataRoleSubskill(roleid);
  console.log(a);
  const selectOptionsUserSubSkill = a.map(item => ({
    name: item.name,
    skillname: item.skillName,
    proficiency:
      item.foRoleSubSkill &&
      item.foRoleSubSkill.length > 0 &&
      item.foRoleSubSkill[0].proficiency
        ? item.foRoleSubSkill[0].proficiency
        : "",
    subscription:
      item.foRoleSubSkill &&
      item.foRoleSubSkill.length > 0 &&
      item.foRoleSubSkill[0].roleId
        ? "Yes"
        : "No",
    id: item.id
  }));
  console.log(selectOptionsUserSubSkill);
  return selectOptionsUserSubSkill;
};
const apiFacadeGetDataRole = async () => {
  try {
    const data = await apiFacade.getData(
      `role/${localStorage.getItem("decoded")}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllRoleSubskill = async roleid => {
  let data = await apiFacadeGetDataRoleSubskill(roleid);
  console.log(data);
  return data;
};
const apiFacadeGetDataRoleSubskill = async roleid => {
  try {
    const data = await apiFacade.getData(
      `subskill/get/${roleid}/${localStorage.getItem("decoded")}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

class CreateRole extends React.Component {
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

      data: [],
      props: "",
      teststate: "0",
      subskillid: 0,
      index: undefined,
      roleid: undefined
    };
  }
  HandleClickVariant = subskillid => () => {
    const item = this.state.data.find(i => i.id === subskillid);
    axios
      .put(
        `https://remnzallocation.azurewebsites.net/api/forolesubskill/${
          this.state.roleid
        }/${subskillid}/${localStorage.getItem("decoded")}/${Number(
          item.proficiency
        )}`
      )
      .then(response => {
        console.log(response);
        console.log(this.state.subskillid);
        this.props.enqueueSnackbar("Success", { variant: "success" });
        this.setState({ index: undefined });
      })

      .catch(error => {
        this.props.enqueueSnackbar(error.message, { variant: "error" });
        this.setState({ index: undefined });
      });

    // variant could be success, error, warning, info, or default
    console.log("duer");

    return null;
  };
  proficiencySubmitHandler = ({ userid, myindex }) => {
    console.log(myindex);
    console.log(this.state.index);

    if (this.state.index == myindex) {
      return (
        <React.Fragment>
          <IconButton>
            <CheckIcon
              type="submit"
              color="primary"
              onClick={this.HandleClickVariant(userid)}
            />
          </IconButton>
        </React.Fragment>
      );
    }

    return "";
  };
  handleChangeInput = myindex => event => {
    this.setState({ index: myindex });
    let id = event.target.id;
    let data = [...this.state.data];
    data[id].proficiency = event.target.value;
    if (data[id].proficiency.length < 1) {
      data[id].proficiency = undefined;
    }
    if (Number(data[id].proficiency) > 100) {
      data[id].proficiency = "100";
    }
    this.setState({ data: data });
  };
  consoleFunction = userid => event => {
    if (event.key == "Enter") {
      this.HandleClickVariant(userid)();
      event.target.blur();
    }
  };

  Unsubscribe = subskillid => {
    console.log(this.state.subskillid);
    apiFacade
      .DeleteData(
        `forolesubskill/${this.state.roleid}/${localStorage.getItem(
          "decoded"
        )}/${subskillid}`
      )

      .then(response => {
        getAllRoleSubskillMapped(this.state.subskillid).then(data => {
          this.setState({ data: data });
          this.setState({ index: undefined });
        });
      });

    //e.preventDefault();
  };
  Subscribe = subskillid => {
    console.log(parseInt(localStorage.getItem("decoded")));

    console.log(this.state.subskillid);
    axios
      .post("https://remnzallocation.azurewebsites.net/api/forolesubskill", {
        clientid: parseInt(localStorage.getItem("decoded")),
        roleid: this.state.roleid,
        subskillid: subskillid
      })
      .then(response => {
        getAllRoleSubskillMapped(this.state.subskillid).then(data => {
          this.setState({ data: data });
          this.setState({ index: undefined });
        });
      });
  };

  componentDidMount() {
    apiFacade
      .getData(`role/${localStorage.getItem("decoded")}`)
      .then(response => {
        console.log(response);
        const selectOptions = response.map(item => ({
          value: item.id,
          label: item.name
        }));
        this.setState({ selectOptions });
      });
  }

  handleChangeRole = async (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);

    console.groupEnd();
    this.setState({ value: newValue }, newState => {});

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };

    if (newValue != null) {
      apiFacade
        .getData(
          `forolesubskill/${localStorage.getItem("decoded")}/${newValue.value}`
        )

        .then(response => {
          const selectOptionsSubSkill = response.map(item => ({
            value: item.foSubSkill.id,
            label: item.foSubSkill.name
          }));
          this.setState({ selectOptionsSubSkill: selectOptionsSubSkill });
        });
    }
    let a = await getAllRoleSubskill(newValue.value);
    this.setState({ roleid: newValue.value });
    this.setState({
      subskillid: newValue.value
    });
    const selectOptionsUserSubSkill = a.map(item => ({
      name: item.name,
      skillname: item.skillName,
      proficiency:
        item.foRoleSubSkill &&
        item.foRoleSubSkill.length > 0 &&
        item.foRoleSubSkill[0].proficiency
          ? item.foRoleSubSkill[0].proficiency
          : "",
      subscription:
        item.foRoleSubSkill &&
        item.foRoleSubSkill.length > 0 &&
        item.foRoleSubSkill[0].roleId
          ? "Yes"
          : "No",
      id: item.id
    }));
    this.setState({ index: undefined, data: selectOptionsUserSubSkill });
  };

  // ------------------------------- SKILL CREATING ------------------------------------->
  handleCreateRole = inputValue => {
    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    this.setState({ isLoadingSkill: true });
    console.group("Option created");
    console.log("Wait a moment...");
    const { selectOptions } = this.state;
    const newOption = createOption(inputValue);
    console.log(newOption.value);
    console.groupEnd();

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    createUpdateRole(newOption, config).then(response => {
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

          this.state.selectOptionsSubSkill = [];
          this.setState({
            isLoadingSkill: false,
            selectOptions: [...newselectOptions],
            value: newOption
          });
          this.handleChangeRole(newOption);
        }
      }
    });
  };
  // ------------------------------------------------------------------------------------------------>

  runTable = () => {
    if (this.state.data.length > 0) {
      const fields = [
        { name: "name", title: "Subskill Name" },
        { name: "skillname", title: "Skill Name" },
        {
          name: "proficiency",
          title: "Proficiency",
          getCellValue: row =>
            row.proficiency == "" && row.subscription == "No"
              ? ""
              : this.state.data.map((item, index) => {
                  return item.id == row.id ? (
                    <div>
                      {console.log(index)}

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

                      <this.proficiencySubmitHandler
                        userid={row.id}
                        myindex={index}
                      />
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
      return <div>No Roles chosen or created...</div>;
    }
  };
  render() {
    const { isLoadingSkill, value } = this.state;
    return (
      <div>
        <Panelheader size="sm" />
        <div className="content">
          <Row>
            <Col xs="6">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle>Select or create Role</CardTitle>
                </CardHeader>
                <CardBody>
                  <CreatableSelect
                    isClearable
                    isLoading={isLoadingSkill}
                    onChange={this.handleChangeRole}
                    onCreateOption={this.handleCreateRole}
                    options={this.state.selectOptions}
                    value={value}
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
export default withSnackbar(CreateRole);
