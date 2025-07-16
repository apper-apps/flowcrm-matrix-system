import { useState, useEffect } from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";
import { cn } from "@/utils/cn";

const ContactList = ({ searchTerm, onContactSelect, className }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
    contact.email.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
    contact.company.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  if (loading) {
    return <Loading type="table" className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadContacts}
        className={className}
      />
    );
  }

  if (contacts.length === 0) {
    return (
      <Empty
        title="No contacts yet"
        description="Start building your network by adding your first contact"
        icon="Users"
        action={{
          label: "Add Contact",
          onClick: () => onContactSelect({ type: "add" }),
          icon: "UserPlus"
        }}
        className={className}
      />
    );
  }

  if (filteredContacts.length === 0) {
    return (
      <Empty
        title="No matches found"
        description="Try adjusting your search terms or add a new contact"
        icon="Search"
        action={{
          label: "Add Contact",
          onClick: () => onContactSelect({ type: "add" }),
          icon: "UserPlus"
        }}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Contacts ({filteredContacts.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr 
                  key={contact.Id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onContactSelect({ type: "view", contact })}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {contact.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.company}</div>
                    <div className="text-sm text-gray-500">{contact.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(contact.lastActivity), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="primary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 2 && (
                        <Badge variant="default" size="sm">
                          +{contact.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onContactSelect({ type: "edit", contact });
                      }}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactList;