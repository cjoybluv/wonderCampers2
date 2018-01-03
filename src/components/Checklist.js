import React, { Component } from 'react';

import { 
  Divider,
  RaisedButton,
  TextField
} from 'material-ui';

class Checklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        instructions: '',
        item: '',
      },
      items: ['1st item']
    };
  }

  handleInput = (e) => {
    const { formData } = this.state;
    formData[e.target.name] = e.target.value;
    this.setState({ formData });
  }

  handleItem = (e) => {
    
    const { formData, items } = this.state;
    console.log('handleInput',items);
    let updatedItems;
    formData[e.target.name] = e.target.value;
    if (e.target.name === 'item' && e.key === 'Enter') {
      updatedItems = items.concat(e.target.value);
      formData['item'] = '';
      this.setState({ formData, items: updatedItems });
    } else {
      this.setState({ formData });
    }
    // e.preventDefault();
  }

  render() {
    const {
      name,
      instructions,
      item,
      items
    } = this.state;

    return (
      <div className="checklist">
        <TextField 
          floatingLabelText="Name"
          floatingLabelFixed={true}
          value={name}
          name="name"
          onChange={this.handleInput}
        />
        <TextField 
          floatingLabelText="Instructions"
          floatingLabelFixed={true}
          value={instructions}
          name="instructions"
          onChange={this.handleInput}
        />
        {/* <form onSubmit={this.submitItem}> */}
          <TextField 
            floatingLabelText="item"
            floatingLabelFixed={true}
            value={item}
            name="item"
            onKeyPress={this.handleItem}
          />
          {/* <RaisedButton type="submit">Go</RaisedButton> */}
        {/* </form> */}
        <Divider />
        <ul>
          {!!items && items.map((item, idx) => 
            <li key={idx} >{item}</li>
          )}
        </ul>
      </div>
    )
  }
};

export default Checklist;
