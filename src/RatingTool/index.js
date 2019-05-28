import React from "react";
import { Grid, Button, Header, Divider, List } from "semantic-ui-react";
import * as _ from "lodash";
import * as values from "./values.json";
import { VerticalProgress } from "../VerticalProgress";
import "./RatingTool.css";

const jsonCrimes = _.sortBy(values["crimes"], "points");
const jsonRatings = values["ratings"];

export class RatingTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = { totalPoints: 0, crimes: [] };
  }

  handlePenalty = (title, points) => {
    if (this.state.totalPoints + points < 0) {
      this.setState(prevState => ({
        totalPoints: 0,
        crimes: [...prevState.crimes, { title, points }]
      }));
    } else {
      this.setState(prevState => ({
        totalPoints: prevState.totalPoints + points,
        crimes: [...prevState.crimes, { title, points }]
      }));
    }
  };

  resetState = () => {
    this.setState({
      totalPoints: 0,
      crimes: []
    });
  };

  render() {
    if (this.state.totalPoints < 0) {
      this.setState({ totalPoints: 0 });
    }

    const pastCrimes = this.state.crimes;
    const totalPoints = this.state.totalPoints;

    const crimeButtons = jsonCrimes.map((crime, i) => (
      <Grid.Row key={"jsoncrime" + i}>
        <Button
          className="crimeButton"
          onClick={() => this.handlePenalty(crime.title, crime.points)}
        >
          {crime.title} ({crime.points})
        </Button>
      </Grid.Row>
    ));

    const eventList = pastCrimes.map((crime, i) => (
      <Grid.Row key={"pastcrime" + i} className="otherRow">
        <Grid.Column>{crime.title}</Grid.Column>
        <Grid.Column>{crime.points}</Grid.Column>
      </Grid.Row>
    ));

    const currentRating = _.findLast(
      jsonRatings,
      ({ min }) => min <= totalPoints
    );
    const nextRating = _.find(jsonRatings, ({ min }) => min > totalPoints);

    return (
      <React.Fragment>
        <Grid columns={3} celled textAlign="center">
          <Grid.Column>
            <Header size="huge" className="topHeader">
              Event buttons
            </Header>
            <Header size="tiny" className="detailHeader">
              Click on the buttons to simulate how a playthrough would go
            </Header>
            <Divider />
            {crimeButtons}
            <Grid.Row>
              <Button
                className="crimeButton resetButton"
                onClick={() => this.resetState()}
              >
                Reset
              </Button>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column>
            <Header size="huge" className="topHeader">
              Rating indicator
            </Header>
            <Header size="tiny" className="detailHeader">
              This would replace the current green/red SA indicator on the HUD
            </Header>
            <Divider />
            <VerticalProgress
              points={totalPoints}
              current={currentRating}
              next={nextRating}
            />
          </Grid.Column>
          <Grid.Column>
            <Header size="huge" className="topHeader">
              Event timeline
            </Header>
            <Header size="tiny" className="detailHeader">
              This would be visible in the post-mission score screen and the
              intel menu
            </Header>
            <Divider />
            <Grid columns={2} divided textAlign="center">
              <Grid.Row className="headerRow">
                <Grid.Column>
                  <Header>Event</Header>
                </Grid.Column>
                <Grid.Column>
                  <Header>Points</Header>
                </Grid.Column>
              </Grid.Row>
              <Divider />
              {eventList}
              {eventList.length > 0 && <Divider />}
              <Grid.Row>
                <Grid.Column>
                  <Header>Total</Header>
                </Grid.Column>
                <Grid.Column>
                  <Header>
                    {totalPoints} ({currentRating.title})
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
        <div className="explanationList">
          <Header>Basic idea:</Header>
          <List bulleted>
            <List.Item>
              Commiting crimes gives you points, the more points you get, the
              worse your rating gets
            </List.Item>
            <List.Item>
              Start mission with 0 points and SA rating, at 10 points ratings
              drops to Professional
            </List.Item>
            <List.Item>
              The meter shows you your current points, your current rating
              (bottom) and the rating you're heading for if you keep getting
              points (top)
            </List.Item>
          </List>
          <Header>A system like this would:</Header>
          <List bulleted>
            <List.Item>
              Make remaining stealthy even after losing SA more meaningful
            </List.Item>
            <List.Item>
              A detailed real time meter makes it easier for people to learn how
              the system works and to keep track of their exact status
            </List.Item>
            <List.Item>
              Allow for more tactical and varied approaches to SA (kill one
              civilian or pacify three)
            </List.Item>
            <List.Item>
              Add an extra 0-point challenge for those who want something
              tougher than SA
            </List.Item>
            <List.Item>
              Take into count repeated mistakes (multiple bodies found), as
              opposed to the current binary system
            </List.Item>
            <List.Item>
              Appropriately penalize different actions depending on their
              severity:
              <List.List>
                <List.Item>
                  Smaller events like loud gunshots can be taken into count
                </List.Item>
                <List.Item>
                  A single mistake doesn't instantly cost you everything, but
                  forces you to be more careful with even smaller things
                </List.Item>
                <List.Item>
                  Taking an accidental step into a trespassing zone and being
                  seen firing a sniper rifle can be treated differently
                </List.Item>
              </List.List>
            </List.Item>
          </List>
        </div>
      </React.Fragment>
    );
  }
}
