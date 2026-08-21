import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { Eye, EyeOff, UploadCloud, FileText, X } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

interface RegistrationForm {
  fullName: string;
  email: string;
  password: string;
  bio: string;
  role: string;
  skills: string[];
  experienceLevel: string;
  notifyByEmail: boolean;
  startDate: Date | null;
  preferredTime: string;
  agreeTerms: boolean;
}

const roles = ["QA Engineer", "SDET", "QA Lead", "Automation Architect", "Manual Tester"];
const skillOptions = ["Selenium", "Playwright", "Cypress", "Postman", "REST Assured", "TestNG", "JMeter"];

export default function FormsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationForm>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      bio: "",
      role: roles[0],
      skills: [],
      experienceLevel: "mid",
      notifyByEmail: true,
      startDate: null,
      preferredTime: "09:00",
      agreeTerms: false,
    },
  });

  const selectedSkills = watch("skills");

  const onSubmit = (values: RegistrationForm) => {
    console.log("Form submitted", values, uploadedFile?.name);
    toast.success("Form submitted successfully.");
    reset();
    setUploadedFile(null);
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5MB limit.");
      return;
    }
    setUploadedFile(file);
    toast.success(`${file.name} attached.`);
  };

  return (
    <div id="forms-page" data-testid="forms-page" className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Forms</h1>
        <p className="text-sm text-slate-500 mt-1">A full set of input types with client-side validation.</p>
      </div>

      <form
        id="registration-form"
        data-testid="registration-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 max-w-3xl"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="full-name-input" className="block text-sm font-medium text-slate-700 mb-1.5">
              Full name
            </label>
            <input
              id="full-name-input"
              data-testid="full-name-input"
              aria-label="Full name"
              type="text"
              placeholder="Jane Doe"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p data-testid="full-name-error" className="mt-1.5 text-xs text-danger-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email-input" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email-input"
              data-testid="email-input"
              aria-label="Email"
              type="email"
              placeholder="jane@company.com"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
            />
            {errors.email && (
              <p data-testid="email-input-error" className="mt-1.5 text-xs text-danger-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password-input" className="block text-sm font-medium text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative max-w-sm">
            <input
              id="password-input"
              data-testid="password-input"
              aria-label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              className="w-full pr-10 px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })}
            />
            <button
              type="button"
              id="password-visibility-toggle"
              data-testid="password-visibility-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
          {errors.password && (
            <p data-testid="password-input-error" className="mt-1.5 text-xs text-danger-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="bio-textarea" className="block text-sm font-medium text-slate-700 mb-1.5">
            Bio
          </label>
          <textarea
            id="bio-textarea"
            data-testid="bio-textarea"
            aria-label="Bio"
            rows={3}
            placeholder="A short professional summary..."
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none"
            {...register("bio")}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="role-select" className="block text-sm font-medium text-slate-700 mb-1.5">
              Role (dropdown)
            </label>
            <select
              id="role-select"
              data-testid="role-select"
              aria-label="Role"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              {...register("role")}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Skills (multi-select)</span>
            <select
              id="skills-multiselect"
              data-testid="skills-multiselect"
              aria-label="Skills, multi-select"
              multiple
              size={4}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              {...register("skills")}
            >
              {skillOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">{selectedSkills?.length ?? 0} selected &middot; ctrl/cmd-click for multiple</p>
          </div>
        </div>

        <fieldset>
          <legend className="block text-sm font-medium text-slate-700 mb-1.5">Experience level (radio buttons)</legend>
          <div id="experience-level-radio-group" data-testid="experience-level-radio-group" className="flex flex-wrap gap-4">
            {[
              { value: "junior", label: "Junior (0-2 yrs)" },
              { value: "mid", label: "Mid (2-5 yrs)" },
              { value: "senior", label: "Senior (5+ yrs)" },
            ].map((opt) => (
              <label key={opt.value} htmlFor={`experience-${opt.value}`} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                <input
                  id={`experience-${opt.value}`}
                  data-testid={`experience-${opt.value}`}
                  type="radio"
                  value={opt.value}
                  aria-label={opt.label}
                  className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                  {...register("experienceLevel")}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="block text-sm font-medium text-slate-700 mb-1.5">Preferred tools (checkboxes)</legend>
          <div id="tools-checkbox-group" data-testid="tools-checkbox-group" className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {["Java", "TypeScript", "Python", "Git", "Docker", "Jenkins"].map((tool) => (
              <label key={tool} htmlFor={`tool-${tool.toLowerCase()}`} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  id={`tool-${tool.toLowerCase()}`}
                  data-testid={`tool-${tool.toLowerCase()}`}
                  type="checkbox"
                  aria-label={tool}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                {tool}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="start-date-picker" className="block text-sm font-medium text-slate-700 mb-1.5">
              Start date (date picker)
            </label>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  id="start-date-picker"
                  data-testid="start-date-picker"
                  selected={field.value}
                  onChange={field.onChange}
                  placeholderText="Select date"
                  dateFormat="MMM d, yyyy"
                  aria-label="Start date"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="preferred-time-input" className="block text-sm font-medium text-slate-700 mb-1.5">
              Preferred time (time picker)
            </label>
            <input
              id="preferred-time-input"
              data-testid="preferred-time-input"
              aria-label="Preferred time"
              type="time"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              {...register("preferredTime")}
            />
          </div>

          <label htmlFor="notify-email-toggle" className="flex items-center gap-2.5 pt-7 cursor-pointer select-none">
            <span className="relative inline-flex items-center">
              <input
                id="notify-email-toggle"
                data-testid="notify-email-toggle"
                type="checkbox"
                role="switch"
                aria-label="Notify by email"
                className="sr-only peer"
                {...register("notifyByEmail")}
              />
              <span className="h-5.5 w-10 rounded-full bg-slate-300 peer-checked:bg-brand-600 transition-colors" />
              <span className="absolute left-0.5 top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4.5" />
            </span>
            <span className="text-sm text-slate-600">Email notifications</span>
          </label>
        </div>

        <div>
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Resume upload</span>
          <div
            id="file-upload-dropzone"
            data-testid="file-upload-dropzone"
            role="button"
            tabIndex={0}
            aria-label="Upload resume file"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange(e.dataTransfer.files?.[0] ?? null);
            }}
            className="border-2 border-dashed border-slate-300 rounded-xl px-6 py-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 max-w-sm"
          >
            <UploadCloud className="h-6 w-6 text-slate-400 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-slate-500">
              <span className="text-brand-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-slate-400 mt-1">PDF or DOCX, up to 5MB</p>
            <input
              ref={fileInputRef}
              id="resume-file-input"
              name="resumeFile"
              data-testid="resume-file-input"
              aria-label="Resume file input"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </div>
          {uploadedFile && (
            <div id="uploaded-file-chip" data-testid="uploaded-file-chip" className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-sm text-slate-600">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              {uploadedFile.name}
              <button
                type="button"
                id="remove-uploaded-file-button"
                data-testid="remove-uploaded-file-button"
                aria-label="Remove uploaded file"
                onClick={() => setUploadedFile(null)}
                className="text-slate-400 hover:text-danger-600"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="agree-terms-checkbox" className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
            <input
              id="agree-terms-checkbox"
              data-testid="agree-terms-checkbox"
              type="checkbox"
              aria-label="Agree to terms and conditions"
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              {...register("agreeTerms", { required: "You must agree to continue" })}
            />
            I agree to the terms and conditions
          </label>
          {errors.agreeTerms && (
            <p data-testid="agree-terms-error" className="mt-1.5 text-xs text-danger-600">
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="submit"
            id="registration-form-submit-button"
            data-testid="registration-form-submit-button"
            aria-label="Submit registration form"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60"
          >
            Submit
          </button>
          <button
            type="button"
            id="registration-form-reset-button"
            data-testid="registration-form-reset-button"
            aria-label="Reset registration form"
            onClick={() => {
              reset();
              setUploadedFile(null);
            }}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
