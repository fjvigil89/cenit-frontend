import React from 'react';
import FileTypesFilledIcon from "../../../icons/FileTypesFilledIcon";

const contentFields = [
    'validators',
    'schema_data_type'
];

const behaviorFields = [
    'before_save_callbacks',
    'after_save_callbacks',
    'records_methods',
    'data_type_methods'
];

const fields = [
    'namespace',
    'name',
    'id_type',
    'title',
    'slug',
    ...contentFields,
    ...behaviorFields
];

const viewport = `{id ${fields.join(' ')}}`;

export default {
    title: 'File Type',
    groups: {
        content: {
            fields: contentFields
        },
        behavior: {
            fields: behaviorFields
        }
    },
    actions: {
        new: {
            fields,
            viewport
        },
        edit: {
            fields: ['id', ...fields],
            viewport
        },
        index: {
            fields: ['namespace', 'name', 'slug', 'id_type', 'updated_at']
        }
    },
    icon: <FileTypesFilledIcon/>
};
