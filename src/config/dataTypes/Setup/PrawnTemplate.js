import React from "react";
import TemplateFilledIcon from "../../../icons/TemplateFilledIcon";
import StringCodeControl from "../../../components/StringCodeControl";

export default {
    title: 'Prawn Template',
    icon: <TemplateFilledIcon/>,
    actions: {
        index: {
            fields: ['namespace', 'name', 'source_data_type', 'bulk_source', 'updated_at']
        },
        new: {
            fields: ['namespace', 'name', 'source_data_type', 'bulk_source', 'code']
        }
    },
    fields: {
        code: {
            control: StringCodeControl,
            controlProps: {
                mime: 'text/x-ruby'
            }
        }
    }
};