import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import OBJECT_NAME from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import getAccountDetails from '@salesforce/apex/handleAccountCntrl.getAccountDetails';
import deleteAccount from '@salesforce/apex/handleAccountCntrl.deleteAccount';
import {refreshApex} from '@salesforce/apex';

const columnsname = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Type', fieldName: 'Type', type: 'text' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
];


export default class AccountOperations extends LightningElement {
    columns = columnsname;
    accountsdata;
    SelectedRows;
    SelectedRowCount;
    selectedRecords
    selectedRecords = [];
    showAddModal = false;
    showDeleteModal = false;
    showUpdateModal = false;
    accToDelete;
    accRecordId = [];
    recordIdToPass;
    accountName = NAME_FIELD;
    accountPhone = PHONE_FIELD;
    accountType = TYPE_FIELD;
    accountIndustry = INDUSTRY_FIELD;
    objName = OBJECT_NAME;
    fields = [NAME_FIELD, PHONE_FIELD, TYPE_FIELD, INDUSTRY_FIELD];

    @wire(getAccountDetails) account({ error, data }) {
        if (data) {
            console.log(JSON.stringify(data));
            this.accountsdata = data;
        }
        else if (error) {
            console.log(error.getmessage());
            this.accountsdata = undefined;
        }
    }

    handleOpenPopup(event) {
        this.showAddModal = true;
    }
    closeAddModal(event){
        this.showAddModal = false;
    }

    handleOpenDeletePopup(event) {
        this.showDeleteModal = true;
    }
    handleCloseDeletePopup(event) {
        this.showDeleteModal = flase;
    }

    handleSuccess() {
        if (this.recordId !== null) {
            this.dispatchEvent(new ShowToastEvent({
                title: "SUCCESS!",
                message: "New record has been created.",
                variant: "success",
            }),
            );
            window.location.reload()
        }
    }

    saveAccountName(event){
        this.accToDelete = event.target.value;
    }

    handleRefresh(event){
        console.log('IN REFRESH');
        return refreshApex(this.data);
    }

    handleUpdate(){
        this.selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
            this.selectedRecords.forEach(element => {
            this.accRecordId.push(element.Id);
        });
        this.recordIdToPass = this.accRecordId.toString();
        if(this.selectedRecords.length > 0){
            this.showUpdateModal = true;
        }
        else {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Please select a Record.',
                variant: 'error'
            }));
        }
       
    }

    handleUpdateSubmit(){
        this.dispatchEvent(new ShowToastEvent({
            title: 'Account Updated Successfully.',
            variant: 'success'
        }));
        window.location.reload();
    }

    handleUpdateClose(){
        this.showUpdateModal = false;
        window.location.reload();
    }

    handleDeleteAccounts(event) {
        this.showDeleteModal = false;
        deleteAccount({ accountName: this.accToDelete })
            .then(result => {
                console.log('Result' + result);
                this.dispatchEvent(new ShowToastEvent({
                    title: "SUCCESS!",
                    message: "Record Deleted.",
                    variant: "success",
                }),
                )
                window.location.reload()
            })
            .catch(error => {
                this.error = error.message;
                alert(JSON.stringify(error))
            })
    }

    handleRowSelection = event => {
        var selectedRows=event.detail.selectedRows;
        if(selectedRows.length>1)
        {
            var el = this.template.querySelector('lightning-datatable');
            selectedRows=el.selectedRows=el.selectedRows.slice(1);
            event.preventDefault();
            return;
        }
    }
    showNotification() {
        const event = new ShowToastEvent({
            title: 'Error',
            message: 'Only one row can be selected',
            variant: 'warning',
            mode: 'pester'
        });
        this.dispatchEvent(event);
    }


    closeModal(event) {
        console.log('onsubmit: ' + event.detail.fields);
        this.showAddModal = false;
    }


}
