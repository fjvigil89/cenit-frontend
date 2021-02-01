import React from 'react';
import ActiveTenants from "../../../components/ActiveTenants";
import Index from "../../../actions/Index";
import SvgIcon from "@material-ui/core/SvgIcon";
import CleanActiveTenants from "../../../actions/CleanActiveTenants";

export const ActiveTenantIconFilled = () => (
    <SvgIcon>
        <g>
            <rect fill="none" height="24" width="24"/>
        </g>
        <g>
            <g>
                <path
                    d="M20,3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V5 C22,3.9,21.1,3,20,3z M10,17H5v-2h5V17z M10,13H5v-2h5V13z M10,9H5V7h5V9z M14.82,15L12,12.16l1.41-1.41l1.41,1.42L17.99,9 l1.42,1.42L14.82,15z"
                    fill-rule="evenodd"/>
            </g>
        </g>
    </SvgIcon>
);

export default {
    title: 'Active Tenant',
    icon: <ActiveTenantIconFilled/>,
    indexComponent: ActiveTenants,
    onlyActions: [Index, CleanActiveTenants]
};
