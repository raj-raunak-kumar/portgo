"use client"
import React, { useState } from 'react';
import SectionWrapper from '@/components/section-wrapper';
import { ALIENS } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/app/actions';
import { SatelliteDish, Paperclip, Loader, Send, Linkedin, Github } from 'lucide-react';


const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const ContactSection = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const modeColor = '#ff3300';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            subject: "",
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const result = await submitContactForm(values);
        setIsLoading(false);

        if (result.success) {
            form.reset();
            toast({
                title: "Message sent",
                description: "Thank you for reaching out. I will respond as soon as possible.",
                variant: "default",
            });
        } else {
            toast({
                title: "Submission Failed",
                description: result.message,
                variant: "destructive",
            });
        }
    }

    return (
        <SectionWrapper title="Contact" subtitle="Collaboration and Communication" color={ALIENS.CONTACT.color}>
            <div className="grid md:grid-cols-2 gap-7 sm:gap-9 md:gap-12 items-center py-3 sm:py-5 md:py-8">
                <div className="text-center md:text-left">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto md:mx-0 rounded-full flex items-center justify-center mb-5 sm:mb-6 md:mb-8 border animate-pulse" style={{ backgroundColor: `${modeColor}1A`, borderColor: `${modeColor}4D` }}>
                        <SatelliteDish className="text-4xl" style={{ color: modeColor }} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Open to research collaboration</h3>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-5 sm:mb-6 md:mb-8">
                        I welcome discussions on research collaborations, academic opportunities, and systems engineering projects.
                    </p>
                    <div className="flex justify-center md:justify-start gap-3 sm:gap-4">
                        <a href="https://www.linkedin.com/in/raj-raunak-kumar-5a4843239/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="p-3 bg-gray-800 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-destructive hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,51,0,0.3)]"><Linkedin className="text-lg sm:text-xl" /></a>
                        <a href="https://github.com/RajRaunak" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="p-3 bg-gray-800 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-destructive hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,51,0,0.3)]"><Github className="text-lg sm:text-xl" /></a>
                    </div>
                </div>
                <div className="p-4 sm:p-6 md:p-8 bg-black/50 border border-white/10 rounded-xl backdrop-blur-sm">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Your Email Address" {...field} className="bg-transparent" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Subject" {...field} className="bg-transparent" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea placeholder="Your Message" {...field} rows={5} className="bg-transparent" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full text-black font-bold rounded transition-all transform hover:scale-105"
                                style={{ backgroundColor: modeColor, boxShadow: `0 0 15px ${modeColor}80` }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2" />
                                        Send message
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default ContactSection;
