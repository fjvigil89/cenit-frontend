import React from 'react';
import ActionRegistry, { ActionKind } from "./ActionRegistry";
import FormEditor from "../components/FormEditor";
import NewIcon from '@material-ui/icons/Add';

const New = ({ docked, dataType, theme, classes, rootId, onItemPickup, height }) => {
    return <FormEditor height={height}
                       docked={docked}
                       dataType={dataType}
                       theme={theme}
                       classes={classes}
                       rootId={rootId}
                       onItemPickup={onItemPickup}/>;
};

export default ActionRegistry.register(New, {
    kind: ActionKind.collection,
    icon: NewIcon,
    title: 'New'
});
