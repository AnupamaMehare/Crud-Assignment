trigger createContact on Account( after insert ){
    List<Contact> contacts=new List<Contact>();
    for(Account a: Trigger.New){
            Contact c=new Contact();
            c.LastName=a.Name;
            c.Phone=a.Phone;
            c.AccountId=a.id;
            contacts.add(c);
        }
    insert contacts;
}
